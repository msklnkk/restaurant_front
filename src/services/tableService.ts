import { RestTable } from '../types/reference.types.ts';
import instance from '../services/axios.config.ts';

const BASE_URL = 'http://localhost:8020';

export const tableService = {
  getAll: async (): Promise<RestTable[]> => {
    const response = await instance.get(`${BASE_URL}/all_tables`);
    return response.data as RestTable[];
  },

  getById: async (id: number): Promise<RestTable> => {
    const response = await instance.get(`${BASE_URL}/table/${id}`);
    return response.data as RestTable;
  },

  create: async (table: Omit<RestTable, 'tableid'>): Promise<RestTable> => {
    const response = await instance.post(`${BASE_URL}/add_table`, table);
    return response.data as RestTable;
  },

  update: async (id: number, table: Partial<RestTable>): Promise<RestTable> => {
    const response = await instance.put(`${BASE_URL}/update_table/${id}`, table);
    return response.data as RestTable;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`${BASE_URL}/delete_table/${id}`);
  }
};