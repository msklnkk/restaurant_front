import axios from 'axios';
import { Dish } from '../types/reference.types';
import instance from '../services/axios.config.ts'


const BASE_URL = 'http://localhost:8020';

export const dishesService = {
  // Получение всех блюд
  getAll: async (): Promise<Dish[]> => {
    const response = await instance.get(`${BASE_URL}/all_dishes`);
    return response.data as Dish[];
  },

  // Получение блюда по ID
  getById: async (id: number): Promise<Dish> => {
    const response = await instance.get(`${BASE_URL}/dish/${id}`);
    return response.data as Dish;
  },

  // Получение блюд по типу
  getByType: async (type: string): Promise<Dish[]> => {
    const response = await instance.get(`${BASE_URL}/dishes/type/${type}`);
    return response.data as Dish[];
  },

  // Добавление нового блюда
  create: async (dish: Omit<Dish, 'dishid'>): Promise<Dish> => {
    const response = await instance.post(`${BASE_URL}/add_dish`, dish);
    return response.data as Dish;
  },

  // Обновление блюда
  update: async (id: number, dish: Partial<Dish>): Promise<Dish> => {
    const response = await instance.put(`${BASE_URL}/update_dish/${id}`, dish);
    return response.data as Dish;
  },

  // Удаление блюда
  delete: async (id: number): Promise<void> => {
    await instance.delete(`${BASE_URL}/delete_dish/${id}`);
  }
};