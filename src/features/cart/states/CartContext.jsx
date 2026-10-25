import { createContext, useContext, useEffect, useState } from "react";

const CART_KEY = "nextowner_cart";
const CHATS_KEY = "nextowner_chats";

export const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem(CHATS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch {}
  }, [chats]);

  const addToCart = (item) => {
    setCart((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const sendMessage = ({ itemId, itemTitle, seller, senderName, text }) => {
    if (!text?.trim()) return;
    const msg = {
      id: Date.now(),
      senderName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setChats((prev) => {
      const current = prev[itemId] || {
        itemId,
        itemTitle,
        seller,
        messages: [],
      };
      return {
        ...prev,
        [itemId]: {
          ...current,
          itemTitle,
          seller,
          messages: [...current.messages, msg],
        },
      };
    });
  };

  const getChat = (itemId) => chats[itemId] || { messages: [] };

  const value = {
    cart,
    cartCount: cart.length,
    addToCart,
    removeFromCart,
    clearCart,
    chats,
    getChat,
    sendMessage,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
