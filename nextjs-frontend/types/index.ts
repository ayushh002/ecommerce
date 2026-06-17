export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // The Mongo ID of the cart document
  productId: string; // The Product ID
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
  subTotal: number;
}

export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
}

export interface OrderItem {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  _id: string;
  userId: string;
  products: OrderItem[];
  totalAmount: number;
  paymentMethod: 'COD';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
