import type { User } from './user';

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthUser = User;

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};
