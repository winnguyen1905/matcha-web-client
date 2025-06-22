import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../context/Cart';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  // Enable Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
