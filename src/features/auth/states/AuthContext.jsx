import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favs, setFavs] = useState([]); 
  const [ready, setReady] = useState(false); // State penanda sesi sudah siap

  useEffect(() => {
    // Cek token di localStorage saat aplikasi pertama kali dimuat
    const token = globalThis.localStorage?.getItem("token");
    if (token) {
      setUser({ token }); 
    }
    // Set ready menjadi true SETELAH pengecekan selesai
    setReady(true); 
  }, []);

  const login = async (token) => {
    globalThis.localStorage?.setItem("token", token);
    setUser({ token });
    setReady(true); // Pastikan ready tetap true saat login
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