import { CATEGORIES, buildQuery, rupiah, tint } from "./toolsHelper";

describe("toolsHelper", () => {
  it("rupiah memformat angka", () => expect(rupiah(185000).replace(/\s/g, "")).toBe("Rp185.000"));
  it("buildQuery membuang nilai kosong", () => {
    expect(buildQuery({ q: "sepeda", category: "", min: 100, max: null })).toBe("q=sepeda&min=100");
  });
  it("tint untuk semua kategori dan kategori tak dikenal", () => {
    CATEGORIES.forEach((c) => expect(tint(c)).toContain("linear-gradient"));
    expect(tint("???")).toContain("hsl(150");
  });
});
