import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favs, setFavs] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = globalThis.localStorage?.getItem("token");
    if (token) {
      setUser({ token });
    }
    setReady(true);
  }, []);

  const login = async (token) => {
    // Simpan token ke localStorage DULU
    globalThis.localStorage?.setItem("token", token);
    // Baru update state
    setUser({ token });
    setReady(true);
  };

  const logout = () => {
    globalThis.localStorage?.removeItem("token");
    setUser(null);
  };

  const toggleFav = (id) => {
    setFavs((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <AuthContext.Provider value={{ user, favs, login, logout, toggleFav, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);