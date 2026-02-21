import { api } from './api';

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
  memberSince: string;
}

export async function register(email: string, password: string, username: string): Promise<AuthUser> {
  const res = await api.post('/auth/register', { email, password, username });
  return res.data;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}
