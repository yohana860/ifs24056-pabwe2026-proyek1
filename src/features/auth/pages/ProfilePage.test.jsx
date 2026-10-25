import { screen, fireEvent, act } from "@testing-library/react";
import ProfilePage from "./ProfilePage";
import { renderWithProviders } from "../../../test-utils";

const toast = () => screen.getByText("Berhasil!").closest("div").parentElement;

describe("ProfilePage", () => {
  afterEach(() => vi.useRealTimers());

  it("menampilkan nilai kosong untuk tamu", () => {
    renderWithProviders(<ProfilePage />);
    expect(screen.getByText("Nama Pengguna")).toBeInTheDocument();
    expect(screen.queryByAltText("Profile")).not.toBeInTheDocument();
  });

  it("mengisi formulir dari data pengguna, termasuk avatar", () => {
    renderWithProviders(<ProfilePage />, { auth: { user: { name: "Ani", email: "a@x.id", phone: "0812", address: "Balige", avatar: "http://x/a.png" } } });
    expect(screen.getByPlaceholderText("Masukkan nama lengkap")).toHaveValue("Ani");
    expect(screen.getByPlaceholderText("Contoh: 081234567890")).toHaveValue("0812");
    expect(screen.getByAltText("Profile")).toHaveAttribute("src", "http://x/a.png");
  });

  it("memakai nilai kosong bila data pengguna tidak lengkap", () => {
    renderWithProviders(<ProfilePage />, { auth: { user: {} } });
    expect(screen.getByPlaceholderText("Masukkan nama lengkap")).toHaveValue("");
    expect(screen.getByPlaceholderText("Masukkan alamat lengkap")).toHaveValue("");
  });

  it("mengubah isian dan foto; memilih foto kosong tidak mengubah apa pun", () => {
    URL.createObjectURL = vi.fn(() => "blob:foto");
    const { container } = renderWithProviders(<ProfilePage />, { auth: { user: { name: "Ani", email: "a@x.id" } } });
    fireEvent.change(screen.getByPlaceholderText("Masukkan nama lengkap"), { target: { name: "name", value: "Ani L" } });
    expect(screen.getByText("Ani L")).toBeInTheDocument();
    const file = container.querySelector('input[type="file"]');
    fireEvent.change(file, { target: { files: [] } });
    expect(screen.queryByAltText("Profile")).not.toBeInTheDocument();
    fireEvent.change(file, { target: { files: [new File(["x"], "f.png", { type: "image/png" })] } });
    expect(screen.getByAltText("Profile")).toHaveAttribute("src", "blob:foto");
  });

  it("menyimpan: tampil memuat, lalu notifikasi muncul dan hilang otomatis", () => {
    vi.useFakeTimers();
    renderWithProviders(<ProfilePage />, { auth: { user: { name: "Ani", email: "a@x.id" } } });
    fireEvent.submit(screen.getByRole("button", { name: /Simpan Perubahan/ }).closest("form"));
    expect(screen.getByText("Menyimpan...")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(toast().className).toContain("translate-x-0");
    act(() => vi.advanceTimersByTime(3000));
    expect(toast().className).toContain("translate-x-full");
  });

  it("notifikasi bisa ditutup manual", () => {
    vi.useFakeTimers();
    renderWithProviders(<ProfilePage />, { auth: { user: { name: "Ani", email: "a@x.id" } } });
    fireEvent.submit(screen.getByRole("button", { name: /Simpan Perubahan/ }).closest("form"));
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.click(toast().querySelector("button"));
    expect(toast().className).toContain("translate-x-full");
    act(() => vi.advanceTimersByTime(3000));
  });
});
