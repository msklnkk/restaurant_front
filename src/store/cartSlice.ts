
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../types/cart.types';

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    return sum + ((item.price.price || 0) * item.quantity);
  }, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
      addToCart: (state, action: PayloadAction<CartItem>) => {
          const existingItem = state.items.find(item => item.dish.dishid === action.payload.dish.dishid);
          if (existingItem) {
              existingItem.quantity += 1;
          } else {
              state.items.push(action.payload);
          }
          state.total = state.items.reduce((sum, item) => {
              const price = item.price.price ?? 0;
              return sum + (price * item.quantity);
          }, 0);
      },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        item => item.dish.dishid !== action.payload
      );
      state.total = calculateTotal(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ dishId: number; quantity: number }>) => {
      const item = state.items.find(
        item => item.dish.dishid === action.payload.dishId
      );
      
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = calculateTotal(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
