import api from './api';
import { CartResponse } from '../types';

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const response = await api.get<CartResponse>('/cart');
    return response.data;
  },

  async addToCart(productId: string, quantity: number): Promise<any> {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  async updateQuantity(productId: string, quantity: number): Promise<any> {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  },

  async removeFromCart(productId: string): Promise<void> {
    await api.delete(`/cart/${productId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },
};
