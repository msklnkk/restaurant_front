
import axios from './axios.config.ts';
import { Order, OrderCreate, OrderStatus, PaymentMethod } from '../types/order.types.ts';
import { CartItem } from '../types/cart.types.ts';

export const OrderService = {
    async createOrder(cartItems: CartItem[], paymentMethod: PaymentMethod, clientId: number): Promise<Order> {
        // Рассчитываем общую сумму заказа
        const calculateTotal = (items: CartItem[]): number => {
            return items.reduce((sum, item) => {
                const itemPrice = item.price?.price || 0;
                return sum + (itemPrice * item.quantity);
            }, 0);
        };

        // Форматируем дату в формат YYYY-MM-DD
        const formatDate = (date: Date): string => {
            return date.toISOString().split('T')[0];
        };

        const orderData: OrderCreate = {
            clientid: Number(clientId),
            payment_method: paymentMethod,
            items: cartItems.map(item => ({
                dishid: item.dish.dishid,
                count: item.quantity
            })),
            tableid: 2, // Можно сделать динамическим
            order_date: formatDate(new Date()),
            total_sum: calculateTotal(cartItems),
            status: OrderStatus.NEW,
            staffid: 1 // Можно сделать динамическим
        };

        try {
            const response = await axios.post<Order>('/add_order', orderData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            throw error;
        }
    },

    async getClientOrders(clientId: number): Promise<Order[]> {
        const response = await axios.get<Order[]>(`/orders/client/${clientId}`);
        return response.data;
    }
};
