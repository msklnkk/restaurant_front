export interface DishPopularity {
  dish_id: number;
  dish_name: string;
  orders_count: number;
  total_revenue: number;
}

export interface PopularDishesResponse {
  dishes: DishPopularity[];
}


export enum InventoryStatus {
  OUT_OF_STOCK = "OUT_OF_STOCK",
  LOW_STOCK = "LOW_STOCK",
  OK = "OK"
}

export interface ProductInventory {
  product_id: number;
  product_name: string;
  quantity: number;
  status: InventoryStatus;
}

export interface InventoryCheckResponse {
  inventory: ProductInventory[];
}


export interface RevenueResponse {
  total_revenue: number;
}

export interface StaffPerformance {
  staff_id: number;
  staff_name: string;
  orders_count: number;
  total_revenue: number;
  avg_order_value: number;
}

export interface StaffPerformanceResponse {
  performance: StaffPerformance[];
}


export interface UpdatePricesRequest {
  dish_type: string;
  price_change_percent: number;
}

export interface UpdatePricesResponse {
  updated_count: number;
}