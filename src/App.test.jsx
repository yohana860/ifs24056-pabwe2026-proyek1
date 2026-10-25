import { screen } from "@testing-library/react";
import App from "./App";
import { getItems } from "./features/items/api/itemApi";
import { getFavorites } from "./features/favorites/api/favoriteApi";
import { renderWithProviders } from "./test-utils";

vi.mock("./features/items/api/itemApi");
vi.mock("./features/favorites/api/favoriteApi");

describe("App routing", () => {
  it("beranda", async () => {
    getItems.mockResolvedValue([]);
    renderWithProviders(<App />);
    expect(await screen.findByText("Barang bekas, pemilik baru.")).toBeInTheDocument();
  });
  it("halaman login dan register", () => {
    renderWithProviders(<App />, { route: "/register" });
    expect(screen.getByRole("heading", { name: "Buat akun" })).toBeInTheDocument();
  });
  it("rute terlindungi mengalihkan tamu", () => {
    renderWithProviders(<App />, { route: "/sell" });
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });
  it("rute terlindungi terbuka untuk pengguna", async () => {
    getFavorites.mockResolvedValue([]);
    renderWithProviders(<App />, { route: "/favorites", auth: { user: { name: "Ani" } } });
    expect(await screen.findByText(/Belum ada favorit/)).toBeInTheDocument();
  });
  it("404", () => {
    renderWithProviders(<App />, { route: "/tidak-ada" });
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
