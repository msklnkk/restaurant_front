import { DishWithQuantity } from "../types/database.types.ts";

export const formatPrice = (price: string | null | undefined): string => {
    if (!price) return '0.00';
    return Number(price).toFixed(2);
};

export const calculateTotal = (
    items: DishWithQuantity[], 
    prices: { [key: number]: string }
): string => {
    return items
        .reduce((sum, item) => {
            const price = prices[item.dishid] ? Number(prices[item.dishid]) : 0;
            return sum + (price * item.quantity);
        }, 0)
        .toFixed(2);
};