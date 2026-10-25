export const CATEGORIES = ["Fashion", "Elektronik", "Furniture", "Buku", "Hobi", "Olahraga", "Rumah Tangga", "Lainnya"];
export const CONDITIONS = ["Seperti Baru", "Baik", "Layak Pakai"];

export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const buildQuery = (filters) =>
  new URLSearchParams(Object.entries(filters).filter(([, v]) => v !== "" && v != null)).toString();

export const tint = (category) => {
  const hue = Math.max(0, CATEGORIES.indexOf(category)) * 42 + 150;
  return `linear-gradient(140deg, hsl(${hue} 55% 88%), hsl(${hue + 30} 50% 76%))`;
};
