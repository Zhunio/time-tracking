import axios from 'axios';
import { env } from '../config/env';
import type { LoginRequest, LoginResponse } from '../types/auth';
import type { CreateUserRequest, UpdateUserRequest, User } from '../types/user';

class ApiService {
  private readonly api = axios.create({
    baseURL: env.baseUrl,
    headers: { 'Content-Type': 'application/json' },
  });

  private readonly authTokenKey = 'authToken';
  private readonly authUserKey = 'authUser';

  constructor() {
    this.api.interceptors.request.use((config) => {
      const authToken = this.getAuthToken();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    });
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAuthToken());
  }

  isAdmin(): boolean {
    return Boolean(this.getCurrentUser()?.isAdmin);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.authUserKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as User;
    } catch {
      return null;
    }
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

  async getUsers(): Promise<User[]> {
    const { data } = await this.api.get('/users');
    return this.extractUsers(data);
  }

  async createUser(payload: CreateUserRequest): Promise<User> {
    const { data } = await this.api.post('/users', payload);
    return this.extractUser(data);
  }

  async updateUser(userId: string, payload: UpdateUserRequest): Promise<User> {
    const { data } = await this.api.patch(`/users/${userId}`, payload);
    return this.extractUser(data);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.api.delete(`/users/${userId}`);
  }

  private getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  private extractUsers(data: unknown): User[] {
    if (Array.isArray(data)) {
      return data as User[];
    }

    if (this.isRecord(data) && Array.isArray(data.data)) {
      return data.data as User[];
    }

    if (this.isRecord(data) && Array.isArray(data.users)) {
      return data.users as User[];
    }

    throw new Error('Unexpected users response format');
  }

  private extractUser(data: unknown): User {
    if (this.isUser(data)) {
      return data;
    }

    if (this.isRecord(data) && this.isUser(data.data)) {
      return data.data;
    }

    if (this.isRecord(data) && this.isUser(data.user)) {
      return data.user;
    }

    throw new Error('Unexpected user response format');
  }

  private isUser(value: unknown): value is User {
    return this.isRecord(value) && typeof value.id === 'string' && typeof value.email === 'string';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}

const apiService = new ApiService();

export default apiService;
