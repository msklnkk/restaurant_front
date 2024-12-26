export interface Dish {
    dishid: number;
    name: string;
    type: string;
    recipe: string;
  }
  
  export interface Product {
    productid: number;
    name: string;
  }
  
  export interface Staff {
    staffid: number;
    name: string;
    job_title: string;
    date_of_hire: string;
    salary: number;
    contact_info: string;
  }
  
  export interface Supplier {
    supplierid: number;
    name: string;
    contact_info: string;
    address: string;
  }
  
  export interface RestTable {
    tableid: number;
    capacity: number;
    location: string;
  }
  
  export interface Drink {
    drinkid: number;
    name: string;
  }
  
  export interface Price {
    priceid: number;
    dishid: number;
    price: number;
    valid_from: string;
    valid_to: string;
    price_type: string;
  }
  
  export const PRICE_TYPES = [
    { value: 'regular', label: 'Обычная цена' },
    { value: 'business_lunch', label: 'Бизнес-ланч' },
    { value: 'special', label: 'Специальное предложение' }
  ];

  export interface DishProduct {
    dishid: number;
    productid: number;
    quantity: number;
  }
  
  export interface ShelfLife {
    shelflifeid: number;
    expirationdate: string;
    deliveryID: number;
  }
  
  export interface OrderedDish {
    orderid: number;
    dishid: number;
    count: number;
  }
  
  export interface OrderedDrink {
    orderid: number;
    drinkid: number;
    count: number;
  }
  
  // Обновим тип ReferenceTableType
  export type ReferenceTableType = 
    | 'dishes' 
    | 'products' 
    | 'staff' 
    | 'suppliers' 
    | 'tables' 
    | 'drinks' 
    | 'prices' 
    | 'dish_products'
    | 'shelf_life'
    | 'ordered_dishes'
    | 'ordered_drinks';
  
  // Обновим состояние справочников
  export interface ReferenceDataState {
    dishes: Dish[];
    products: Product[];
    staff: Staff[];
    suppliers: Supplier[];
    tables: RestTable[];
    drinks: Drink[];
    prices: Price[];
    dish_products: DishProduct[];
    shelf_life: ShelfLife[];
    ordered_dishes: OrderedDish[];
    ordered_drinks: OrderedDrink[];
  }