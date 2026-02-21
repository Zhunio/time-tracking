import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const Api = {
  loginUrl: BASE_URL + "/auth/login",
  register: BASE_URL + "/auth/register",
};

export const login = async ({ email, password }) => {
  const { accessToken, user } = await axios.post(
    Api.loginUrl,
    { email, password },
    { headers: { "Content-Type": "application/json" } },
  );

  persistAuthSession({ accessToken, user });

  return { accessToken, user };
};

const persistAuthSession = ({ accessToken, user }) => {
  localStorage.setItem("authToken", accessToken);
  localStorage.setItem("authUser", JSON.stringify(user));
};
