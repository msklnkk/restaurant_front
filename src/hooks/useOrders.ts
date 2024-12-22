import { useState } from 'react';
import { OrderService } from '../services/order.service.ts';
import { PaymentMethod } from '../types/order.types.ts';
import { useAuth } from './useAuth.ts';
import { CartItem } from '../types/cart.types.ts';

export const useOrders = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOrder = async (
        cartItems: CartItem[], 
        paymentMethod: PaymentMethod,
        clientId: number
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const order = await OrderService.createOrder(cartItems, paymentMethod, clientId);
            return order;
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка при создании заказа');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createOrder, isLoading, error };
};