import { Price } from '../types/reference.types.ts';
import instance from '../services/axios.config.ts';

const BASE_URL = 'http://localhost:8020';

export const priceService = {
  getAll: async (): Promise<Price[]> => {
    const response = await instance.get(`${BASE_URL}/all_prices`);
    return response.data as Price[];
  },

  getById: async (id: number): Promise<Price> => {
    const response = await instance.get(`${BASE_URL}/price/${id}`);
    return response.data as Price;
  },

  create: async (price: Omit<Price, 'priceid'>): Promise<Price> => {
    const response = await instance.post(`${BASE_URL}/add_price`, price);
    return response.data as Price;
  },

  update: async (id: number, price: Partial<Price>): Promise<Price> => {
    const response = await instance.put(`${BASE_URL}/update_price/${id}`, price);
    return response.data as Price;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`${BASE_URL}/delete_price/${id}`);
  }
};