import { apiFetch } from "../../../helpers/apiHelper";

export const login = (data) => apiFetch("/auth/login", { method: "POST", body: data });
export const register = (data) => apiFetch("/auth/register", { method: "POST", body: data });
export const getMe = () => apiFetch("/auth/me");
