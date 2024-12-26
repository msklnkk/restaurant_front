import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, PaymentMethod } from '../types/order.types.ts';
import axios from 'axios';
import { CartItem } from '../types/cart.types.ts';
import { OrderService } from '../services/order.service.ts';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null
};

// Интерфейс для создания заказа
interface CreateOrderRequest {
  cartItems: CartItem[];
  paymentMethod: PaymentMethod;
  clientId: number;
}

// Создаем заказ с явным указанием типов
export const submitOrder = createAsyncThunk<Order, CreateOrderRequest>(
  'orders/submit',
  async ({ cartItems, paymentMethod, clientId }) => {
    return await OrderService.createOrder(cartItems, paymentMethod, clientId);
  }
);

// Получаем заказы с явным указанием типов
export const fetchClientOrders = createAsyncThunk<Order[], number>(
  'orders/fetchByClient',
  async (clientId) => {
    const response = await axios.get<Order[]>(`/api/orders/client/${clientId}`);
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      })
      .addCase(fetchClientOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchClientOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при получении заказов';
      });
  }
});

export default orderSlice.reducer;