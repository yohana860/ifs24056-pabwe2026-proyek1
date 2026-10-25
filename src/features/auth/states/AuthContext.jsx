import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favs, setFavs] = useState([]); // Asumsi ada state favorit
  const [ready, setReady] = useState(false); 

  // Cek token saat aplikasi pertama kali dimuat
  useEffect(() => {
    const token = globalThis.localStorage?.getItem("token");
    if (token) {
      // Jika ada token, anggap user sudah login
      // (Idealnya panggil API untuk verifikasi token dan ambil data user)
      setUser({ token }); 
    }
    setReady(true); 
  }, []);

  const login = async (token) => {
    globalThis.localStorage?.setItem("token", token); // Simpan token ke localStorage
    setUser({ token }); // Update state
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