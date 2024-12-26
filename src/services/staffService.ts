import { Staff } from '../types/reference.types.ts';
import instance from './axios.config.ts';

export const staffService = {
  getAll: async (): Promise<Staff[]> => {
    const response = await instance.get('/all_staff');
    return response.data as Staff[];
  },

  getById: async (id: number): Promise<Staff> => {
    const response = await instance.get(`/staff/${id}`);
    return response.data as Staff;
  },

  create: async (staff: Omit<Staff, 'staffid'>): Promise<Staff> => {
    const response = await instance.post('/add_staff', staff);
    return response.data as Staff;
  },

  update: async (id: number, staff: Partial<Staff>): Promise<Staff> => {
    const response = await instance.put(`/update_staff/${id}`, staff);
    return response.data as Staff;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`/delete_staff/${id}`);
  }
};