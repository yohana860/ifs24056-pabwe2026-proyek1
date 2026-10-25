import { apiFetch } from "../../../helpers/apiHelper";

export const getItems = (filters) => apiFetch("/items", { query: filters });
export const getItem = (id) => apiFetch(`/items/${id}`);
export const getMyItems = () => apiFetch("/items/mine");
export const createItem = (data) => apiFetch("/items", { method: "POST", body: data });
export const updateItem = (id, data) => apiFetch(`/items/${id}`, { method: "PUT", body: data });
export const deleteItem = (id) => apiFetch(`/items/${id}`, { method: "DELETE" });
