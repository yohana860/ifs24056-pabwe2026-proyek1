import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "./features/auth/states/AuthContext.jsx";
import { CartProvider } from "./features/cart/states/CartContext.jsx";

export const makeAuth = (overrides = {}) => ({
  user: null, favs: [], ready: true,
  login: vi.fn(), logout: vi.fn(), toggleFav: vi.fn(),
  ...overrides,
});

export function renderWithProviders(ui, { route = "/", auth = {} } = {}) {
  const value = makeAuth(auth);
  const utils = render(
    <AuthContext.Provider value={value}>
      <CartProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </CartProvider>
    </AuthContext.Provider>,
  );
  return { ...utils, auth: value };
}

export const sampleItem = (o = {}) => ({
  id: 1, title: "Sepeda Lipat", price: 1200000, category: "Olahraga", condition: "Baik", city: "Medan",
  description: "Masih mulus", image: "", status: "available", seller: { id: 2, name: "Sinta", email: "s@x.id" }, ...o,
});
