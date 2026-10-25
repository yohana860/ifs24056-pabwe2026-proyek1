import * as helper from "../helpers/apiHelper";
import * as authApi from "./auth/api/authApi";
import * as itemApi from "./items/api/itemApi";
import * as favoriteApi from "./favorites/api/favoriteApi";

describe("lapisan API", () => {
  it("memetakan setiap fungsi ke endpoint yang benar", () => {
    const spy = vi.spyOn(helper, "apiFetch").mockResolvedValue({});
    authApi.login({ a: 1 }); authApi.register({ b: 2 }); authApi.getMe();
    itemApi.getItems({ q: "x" }); itemApi.getItem(3); itemApi.getMyItems();
    itemApi.createItem({ c: 3 }); itemApi.updateItem(3, { d: 4 }); itemApi.deleteItem(3);
    favoriteApi.getFavoriteIds(); favoriteApi.getFavorites(); favoriteApi.toggleFavorite(3);
    expect(spy.mock.calls.map((c) => [c[0], c[1]?.method ?? "GET"])).toEqual([
      ["/auth/login", "POST"], ["/auth/register", "POST"], ["/auth/me", "GET"],
      ["/items", "GET"], ["/items/3", "GET"], ["/items/mine", "GET"],
      ["/items", "POST"], ["/items/3", "PUT"], ["/items/3", "DELETE"],
      ["/favorites/ids", "GET"], ["/favorites", "GET"], ["/favorites/3", "POST"],
    ]);
  });
});
