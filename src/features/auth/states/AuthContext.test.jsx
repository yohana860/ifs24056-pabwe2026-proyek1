import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext";
import { getMe } from "../api/authApi";
import { getFavoriteIds, toggleFavorite } from "../../favorites/api/favoriteApi";
import { putAccessToken } from "../../../helpers/apiHelper";

vi.mock("../api/authApi");
vi.mock("../../favorites/api/favoriteApi");

function Probe() {
  const a = useAuth();
  return (
    <div>
      <span data-testid="u">{a.user?.name || "none"}</span>
      <span data-testid="f">{a.favs.join(",")}</span>
      <span data-testid="r">{String(a.ready)}</span>
      <button onClick={() => a.login("tok")}>login</button>
      <button onClick={a.logout}>logout</button>
      <button onClick={() => a.toggleFav(2)}>fav</button>
    </div>
  );
}
const setup = () => render(<AuthProvider><Probe /></AuthProvider>);

describe("AuthProvider", () => {
  it("siap langsung bila tidak ada token", () => {
    setup();
    expect(screen.getByTestId("r")).toHaveTextContent("true");
    expect(getMe).not.toHaveBeenCalled();
  });

  it("memuat pengguna dan favorit bila token ada", async () => {
    putAccessToken("tok");
    getMe.mockResolvedValue({ user: { name: "Ani" } });
    getFavoriteIds.mockResolvedValue({ ids: [1, 2] });
    setup();
    await waitFor(() => expect(screen.getByTestId("u")).toHaveTextContent("Ani"));
    expect(screen.getByTestId("f")).toHaveTextContent("1,2");
  });

  it("membersihkan sesi bila token tidak valid", async () => {
    putAccessToken("bad");
    getMe.mockRejectedValue(new Error("x"));
    setup();
    await waitFor(() => expect(screen.getByTestId("r")).toHaveTextContent("true"));
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("login, toggleFav, dan logout", async () => {
    getMe.mockResolvedValue({ user: { name: "Budi" } });
    getFavoriteIds.mockResolvedValue({ ids: [] });
    toggleFavorite.mockResolvedValue({ ids: [2] });
    setup();
    await userEvent.click(screen.getByText("login"));
    await waitFor(() => expect(screen.getByTestId("u")).toHaveTextContent("Budi"));
    await userEvent.click(screen.getByText("fav"));
    await waitFor(() => expect(screen.getByTestId("f")).toHaveTextContent("2"));
    await userEvent.click(screen.getByText("logout"));
    expect(screen.getByTestId("u")).toHaveTextContent("none");
  });
});
