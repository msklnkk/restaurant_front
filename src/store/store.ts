
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice.ts';
import orderReducer from './orderSlice.ts';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
