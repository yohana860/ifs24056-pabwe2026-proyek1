import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { login, register } from "../api/authApi";
import { renderWithProviders } from "../../../test-utils";

vi.mock("../api/authApi");

describe("LoginPage", () => {
  it("masuk dengan sukses", async () => {
    login.mockResolvedValue({ token: "t" });
    const { auth } = renderWithProviders(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Email"), "a@x.id");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(auth.login).toHaveBeenCalledWith("t"));
    expect(login).toHaveBeenCalledWith({ email: "a@x.id", password: "secret1" });
  });

  it("menampilkan pesan error", async () => {
    login.mockRejectedValue(new Error("Email atau kata sandi salah"));
    renderWithProviders(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Email"), "a@x.id");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("salah");
  });
});

describe("RegisterPage", () => {
  it("mendaftar dengan semua kolom", async () => {
    register.mockResolvedValue({ token: "t2" });
    const { auth } = renderWithProviders(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Nama"), "Ani");
    await userEvent.selectOptions(screen.getByLabelText("Provinsi"), "Sumatera Utara");
    await userEvent.selectOptions(screen.getByLabelText("Kabupaten / Kota"), "Kabupaten Toba");
    await userEvent.type(screen.getByLabelText("Alamat lengkap"), "Jl. Sisingamangaraja No. 12");
    await userEvent.type(screen.getByLabelText("Email"), "a@x.id");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await waitFor(() => expect(auth.login).toHaveBeenCalledWith("t2"));
    expect(register).toHaveBeenCalledWith({
      name: "Ani",
      email: "a@x.id",
      password: "secret1",
      province: "Sumatera Utara",
      city: "Kabupaten Toba",
      address: "Jl. Sisingamangaraja No. 12",
    });
    expect(screen.getByRole("link", { name: "Masuk" })).toHaveAttribute("href", "/login");
  });
});
