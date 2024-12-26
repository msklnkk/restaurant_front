import { Product } from '../types/reference.types.ts';
import instance from './axios.config.ts';

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const response = await instance.get('/all_products');
    return response.data as Product[];
  },

  getById: async (id: number): Promise<Product> => {
    const response = await instance.get(`/product/${id}`);
    return response.data as Product;
  },

  create: async (product: Omit<Product, 'productid'>): Promise<Product> => {
    const response = await instance.post('/add_product', product);
    return response.data as Product;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await instance.put(`/update_product/${id}`, product);
    return response.data as Product;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/delete_product/${id}`);
  }
};