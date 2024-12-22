export interface Order {
    orderid: number;
    tableid: number | null;
    order_date: Date | null;
    total_sum: number | null;
    status: string | null;
    staffid: number | null;
    clientid: number | null;
    payment_method: string | null;
}


export enum OrderStatus {
    NEW = 'Новый',               // Только что создан
    CONFIRMED = 'Подтвержден',   // Подтвержден рестораном
    COOKING = 'Готовится',       // Готовится
    READY = 'Готов к выдаче',          // Готов к выдаче
    COMPLETED = 'Выполнен',   // Выполнен
    CANCELLED = 'Отменен'    // Отменен
}

export enum PaymentMethod {
    CASH = 'Наличные',            // Наличные
    CARD = 'Банковская карта',            // Банковская карта
    ONLINE = 'Онлайн оплата'         // Онлайн оплата
}

export interface OrderCreate {
    clientid: number;
    payment_method: PaymentMethod;
    items: OrderItem[];
    tableid: number;
    order_date: string;
    total_sum: number;
    status: OrderStatus;
    staffid: number;
}

export interface OrderItem {
    dishid: number;
    count: number;
}