import api from './api';
import { Order } from '../types';

export const ordersService = {
  async placeOrder(paymentMethod: 'COD' = 'COD'): Promise<Order> {
    const response = await api.post<Order>('/orders', { paymentMethod });
    return response.data;
  },

  async getOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },
};
