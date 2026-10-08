export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export type MenuItemInput = Omit<MenuItem, 'id'>;

export type OrderSize = 'small' | 'medium' | 'large';

export interface Order {
  id: number;
  dish: string;
  price: number;
  served: boolean;
  size: OrderSize;
}

export interface Health {
  status: string;
}
