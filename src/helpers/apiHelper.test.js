import { BASE_URL, apiFetch, getAccessToken, putAccessToken } from "./apiHelper";

const reply = (ok, text, status = 200) => vi.fn().mockResolvedValue({ ok, status, text: () => Promise.resolve(text) });

describe("apiHelper", () => {
  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBe("");
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    putAccessToken("");
    expect(getAccessToken()).toBe("");
  });

  it("mengirim token, body JSON, dan query", async () => {
    putAccessToken("abc");
    const fetchMock = reply(true, '{"ok":1}');
    vi.stubGlobal("fetch", fetchMock);
    expect(await apiFetch("/items", { method: "POST", body: { a: 1 }, query: { q: "x", empty: "" } })).toEqual({ ok: 1 });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/items?q=x`);
    expect(opts.headers.Authorization).toBe("Bearer abc");
    expect(opts.body).toBe('{"a":1}');
    vi.unstubAllGlobals();
  });

  it("GET tanpa token, tanpa body, dan body kosong", async () => {
    const fetchMock = reply(true, "");
    vi.stubGlobal("fetch", fetchMock);
    expect(await apiFetch("/x")).toEqual({});
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
    expect(fetchMock.mock.calls[0][1].body).toBeUndefined();
    vi.unstubAllGlobals();
  });

  it("melempar error dari server, dari teks biasa, dan default", async () => {
    vi.stubGlobal("fetch", reply(false, '{"error":"Gagal"}', 400));
    await expect(apiFetch("/x")).rejects.toThrow("Gagal");
    vi.stubGlobal("fetch", reply(false, "Bad Gateway", 502));
    await expect(apiFetch("/x")).rejects.toThrow("Bad Gateway");
    vi.stubGlobal("fetch", reply(false, "", 500));
    await expect(apiFetch("/x")).rejects.toThrow("Request gagal (500)");
    vi.unstubAllGlobals();
  });
});
