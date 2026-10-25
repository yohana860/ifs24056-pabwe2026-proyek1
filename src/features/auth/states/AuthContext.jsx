import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe } from "../api/authApi";
import { getFavoriteIds, toggleFavorite } from "../../favorites/api/favoriteApi";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favs, setFavs] = useState([]);
  const [ready, setReady] = useState(!getAccessToken());

  const refresh = useCallback(async () => {
    try {
      const me = await getMe();
      const fav = await getFavoriteIds();
      setUser(me.user);
      setFavs(fav.ids);
    } catch {
      putAccessToken("");
      setUser(null);
      setFavs([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (getAccessToken()) refresh();
  }, [refresh]);

  const value = useMemo(() => ({
    user, favs, ready,
    login: async (token) => { putAccessToken(token); await refresh(); },
    logout: () => { putAccessToken(""); setUser(null); setFavs([]); },
    toggleFav: async (id) => setFavs((await toggleFavorite(id)).ids),
  }), [user, favs, ready, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
