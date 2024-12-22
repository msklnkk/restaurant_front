import { Dish, Price } from './database.types';

export interface CartItem {
    dish: Dish;
    price: Price;
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    total: number;
}