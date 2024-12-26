import { Supplier } from '../types/reference.types.ts';
import instance from '../services/axios.config.ts';

const BASE_URL = 'http://localhost:8020';

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const response = await instance.get(`${BASE_URL}/all_suppliers`);
    return response.data as Supplier[];
  },

  getById: async (id: number): Promise<Supplier> => {
    const response = await instance.get(`${BASE_URL}/supplier/${id}`);
    return response.data as Supplier;
  },

  create: async (supplier: Omit<Supplier, 'supplierid'>): Promise<Supplier> => {
    const response = await instance.post(`${BASE_URL}/add_supplier`, supplier);
    return response.data as Supplier;
  },

  update: async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
    const response = await instance.put(`${BASE_URL}/update_supplier/${id}`, supplier);
    return response.data as Supplier;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`${BASE_URL}/delete_supplier/${id}`);
  }
};