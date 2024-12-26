import { Drink } from '../types/reference.types';
import axios from 'axios';
import instance from '../services/axios.config.ts'


const BASE_URL = 'http://localhost:8020';

export const drinksService = {
  getAll: async (): Promise<Drink[]> => {
    const response = await instance.get(`${BASE_URL}/all_drinks`);
    return response.data as Drink[];
  },

  getById: async (id: number): Promise<Drink> => {
    const response = await instance.get(`${BASE_URL}/drink/${id}`);
    return response.data as Drink;
  },

  create: async (drink: Omit<Drink, 'drinkid'>): Promise<Drink> => {
    const response = await instance.post(`${BASE_URL}/add_drink`, drink);
    return response.data as Drink;
  },

  update: async (id: number, drink: Partial<Drink>): Promise<Drink> => {
    const response = await instance.put(`${BASE_URL}/update_drink/${id}`, drink);
    return response.data as Drink;
  },

  delete: async (id: number): Promise<void> => {
    await instance.delete(`${BASE_URL}/delete_drink/${id}`);
  }
};