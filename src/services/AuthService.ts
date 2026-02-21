import axios from 'axios';
import type { LoginRequest, LoginResponse } from '../types/auth';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class AuthService {
  private readonly api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  async login({ email, password }: LoginRequest): Promise<void> {
    const {
      data: { user, accessToken },
    } = await this.api.post<LoginResponse>('/auth/login', { email, password });

    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
}

const authService = new AuthService();

export default authService;
