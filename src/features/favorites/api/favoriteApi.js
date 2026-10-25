import { apiFetch } from "../../../helpers/apiHelper";

export const getFavoriteIds = () => apiFetch("/favorites/ids");
export const getFavorites = () => apiFetch("/favorites");
export const toggleFavorite = (id) => apiFetch(`/favorites/${id}`, { method: "POST" });
