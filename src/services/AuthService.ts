import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_BASE_URL;

type AuthUser = Record<string, unknown>;

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

const Api = {
  loginUrl: BASE_URL + '/auth/login',
  register: BASE_URL + '/auth/register',
};

export const login = async ({ email, password }: LoginPayload) => {
  const { data } = await axios.post<LoginResponse>(
    Api.loginUrl,
    { email, password },
    { headers: { 'Content-Type': 'application/json' } },
  );
  const { accessToken, user } = data;

  persistAuthSession({ accessToken, user });

  return { accessToken, user };
};

const persistAuthSession = ({ accessToken, user }: LoginResponse) => {
  localStorage.setItem('authToken', accessToken);
  localStorage.setItem('authUser', JSON.stringify(user));
};
