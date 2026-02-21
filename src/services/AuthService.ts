import axios from 'axios';
import type { LoginRequest, LoginResponse } from '../types/auth';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class AuthService {
  private readonly api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  private readonly authTokenKey = 'authToken';
  private readonly authUserKey = 'authUser';

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(this.authTokenKey));
  }

  async login({ email, password }: LoginRequest): Promise<void> {
    const {
      data: { user, accessToken },
    } = await this.api.post<LoginResponse>('/auth/login', { email, password });

    localStorage.setItem(this.authTokenKey, accessToken);
    localStorage.setItem(this.authUserKey, JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.authUserKey);
  }
}

const authService = new AuthService();

export default authService;
