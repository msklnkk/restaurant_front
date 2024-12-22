// Клиенты
export interface Client {
    clientid: number;
    name: string | null;
    phone_number: string | null;
    mail: string | null;
    discount_percentage: number | null;
    is_admin: boolean;
    password: string;
}

// Напитки
export interface Drink {
    drinkid: number;
    name: string | null;
}
  
// Цены
export interface Price {
    priceid: number;
    dishid: number;
    price: number | null;
    valid_from: Date | null;
    valid_to: Date | null;
    price_type: string | null;
}

// Продукты
export interface Product {
    productid: number;
    name: string | null;
}
  
// Персонал
export interface Staff {
    staffid: number;
    name: string | null;
    job_title: string | null;
    date_of_hire: Date | null;
    salary: number | null;
    contact_info: string | null;
}
  
// Поставщики
export interface Supplier {
    supplierid: number;
    name: string | null;
    contact_info: string | null;
    address: string | null;
}
  
// Столы
export interface Table {
    tableid: number;
    capacity: number | null;
    location: string | null;
}
  
// Доставки
export interface Delivery {
    deliveryid: number;
    datedelivery: Date | null;
}

// DishProducts
export interface DishProduct {
    dishid: number;
    productid: number;
    quantity: number | null;
}
  
// Блюда
export interface Dish {
    dishid: number;
    name: string | null;
    type: string | null;
    recipe: string | null;
}
  
// Продукты в доставке
export interface ProductInDelivery {
    productid: number;
    deliveryid: number;
    count: number | null;
    cost: number | null;
}
  
// Срок годности
export interface ShelfLife {
    shelflifeid: number;
    expirationdate: Date | null;
    deliveryID: number;
}
  
// Заказанные блюда
export interface OrderedDish {
    orderid: number;
    dishid: number;
    count: number | null;
}
  
// Заказанные напитки
export interface OrderedDrink {
    orderid: number;
    drinkid: number;
    count: number | null;
}


// Расширенный интерфейс для блюда с количеством (для корзины)
export interface DishWithQuantity extends Dish {
    quantity: number;
}