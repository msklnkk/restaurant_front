import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../types/order.types.ts';
import axios from 'axios';

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
  clientId: number;
  items: { dishId: number; count: number }[];
  totalSum: number;
}

// Создаем заказ с явным указанием типов
export const createOrder = createAsyncThunk<Order, CreateOrderRequest>(
  'orders/create',
  async (orderData) => {
    const response = await axios.post<Order>('/api/add_order', orderData);
    return response.data;
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
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
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