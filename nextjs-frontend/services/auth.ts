import api from './api';
import { AuthResponse, User } from '../types';
import { RegisterDto } from '@/schemas/auth-schema'; // will create this schema soon
import { LoginDto } from '@/schemas/auth-schema';

export const authService = {
  async register(data: RegisterDto): Promise<User> {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },
};
