import { http } from "./http";

async function register(payload) {
  const { data } = await http.post("/auth/register", payload);
  return data;
}

async function login(payload) {
  const { data } = await http.post("/auth/login", payload);
  return data;
}

export const authApi = {
  register,
  login
};

export { register, login };
