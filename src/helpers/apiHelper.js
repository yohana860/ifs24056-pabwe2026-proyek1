import { buildQuery } from "./toolsHelper";

export const BASE_URL = import.meta.env.VITE_API_URL || "https://GANTI-DENGAN-URL-BACKEND/api";
export const TOKEN_KEY = "token";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const putAccessToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export async function apiFetch(path, { method = "GET", body, query } = {}) {
  const qs = query ? buildQuery(query) : "";
  const headers = { Accept: "application/json" };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  const response = await fetch(`${BASE_URL}${path}${qs ? `?${qs}` : ""}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text };
  }
  if (!response.ok) throw new Error(data.error || `Request gagal (${response.status})`);
  return data;
}
