import axios from 'axios';
import type { AuthUser, LoginRequest, LoginResponse } from '../types/auth';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class AuthService {
  private readonly api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  private readonly authTokenKey = 'authToken';
  private readonly authUserKey = 'authUser';

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const { data } = await this.api.post<LoginResponse>('/auth/login', { email, password });
    this.persistAuthSession(data);
    return data;
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem(this.authUserKey);
    if (!user) return null;

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.authUserKey);
  }

  private persistAuthSession({ accessToken, user }: LoginResponse): void {
    localStorage.setItem(this.authTokenKey, accessToken);
    localStorage.setItem(this.authUserKey, JSON.stringify(user));
  }
}

const authService = new AuthService();

export default authService;
