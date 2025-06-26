import { useEffect, useState } from 'react';
import { Client, Functions } from 'appwrite';
import useIpCountry from 'react-ipgeolocation';      // country guess

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const functions = new Functions(client);

interface Params {
  zip: string;
  state: string;
  amount: number;
  shipping?: number;
}

export function useSalesTax({ zip, state, amount, shipping = 0 }: Params) {
  const { country } = useIpCountry();
  const [tax, setTax] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (country !== 'US' || !zip || !state || amount <= 0) {
      setTax(0);
      return;
    }

    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const execution = await functions.createExecution(
          import.meta.env.VITE_TAX_FN_ID,           // functionId
          JSON.stringify({ to_zip: zip, to_state: state, amount, shipping }),
          true                                      // async = true (returns immediately)
        );

        // wait for the function to finish (simple polling)
        let result: any = execution;
        while (result.status === 'processing') {
          await new Promise(r => setTimeout(r, 750));
          result = await functions.getExecution(result.$id, import.meta.env.VITE_TAX_FN_ID);
        }

        if (cancel) return;
        const data = JSON.parse(result.response);
        setTax(data.salesTax ?? 0);
      } catch {
        if (!cancel) setTax(null);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [zip, state, amount, shipping, country]);

  return { tax, loading };
}
