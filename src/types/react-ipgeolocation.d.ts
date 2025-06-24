declare module 'react-ipgeolocation' {
  export interface IPGeoLocationResult {
    country: string | null;
    countryCode: string | null;
    region: string | null;
    regionName: string | null;
    city: string | null;
    zip: string | null;
    lat: number | null;
    lon: number | null;
    timezone: string | null;
    isp: string | null;
    org: string | null;
    as: string | null;
    query: string | null;
    status: 'pending' | 'success' | 'error';
    error?: Error;
  }

  export function useIPGeoLocation(): IPGeoLocationResult;

  // For backward compatibility with the default export
  const useIpCountry: () => { country: string | null };
  export default useIpCountry;
}
