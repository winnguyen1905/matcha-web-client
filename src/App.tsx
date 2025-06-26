import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthProvider } from "./hooks/useAuth";
import { UserProvider } from "./hooks/useAccount";
import { ProductsProvider } from "./hooks/Product";
import { OrdersProvider } from "./hooks/Order";
import { TaxProvider } from "./hooks/Tax";
import AppRoutes from "./routes";
import { lightTheme } from "./theme";
import { NotificationProvider } from "./context/NotificationContext";
import { AccountProvider } from "./hooks/Account";
import { DiscountsProvider } from "./hooks/Discount";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BrowserRouter>
            <AuthProvider>
              <UserProvider>
                <NotificationProvider>
                  <AccountProvider>
                    <TaxProvider>
                      <ProductsProvider>
                        <OrdersProvider>
                          <DiscountsProvider>
                            <AppRoutes />
                          </DiscountsProvider>
                        </OrdersProvider>
                      </ProductsProvider>
                    </TaxProvider>
                  </AccountProvider>
                </NotificationProvider>
              </UserProvider>
            </AuthProvider>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
