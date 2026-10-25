import { INDONESIA_PROVINCES, REGIONS_BY_PROVINCE, getRegencies, formatLocation } from "./locations";

describe("locations helper", () => {
  it("memiliki daftar provinsi Indonesia", () => {
    expect(INDONESIA_PROVINCES.length).toBeGreaterThan(30);
    expect(INDONESIA_PROVINCES).toContain("Sumatera Utara");
    expect(INDONESIA_PROVINCES).toContain("DKI Jakarta");
  });

  it("getRegencies mengembalikan kabupaten untuk provinsi terdaftar", () => {
    const sumut = getRegencies("Sumatera Utara");
    expect(sumut).toContain("Kabupaten Toba");
    expect(sumut).toContain("Kota Medan");
  });

  it("getRegencies menangani provinsi tanpa daftar spesifik atau input kosong", () => {
    expect(getRegencies("")).toEqual([]);
    expect(getRegencies(null)).toEqual([]);
    const defaultList = getRegencies("Papua Barat Daya");
    expect(defaultList[0]).toContain("Papua Barat Daya");
  });

  it("formatLocation menggabungkan alamat, kota, dan provinsi", () => {
    expect(formatLocation({ address: "Jl. Balige 1", city: "Toba", province: "Sumatera Utara" }))
      .toBe("Jl. Balige 1, Toba, Sumatera Utara");
    expect(formatLocation({ city: "Medan" })).toBe("Medan");
    expect(formatLocation({})).toBe("Indonesia");
    expect(formatLocation()).toBe("Indonesia");
  });
});
