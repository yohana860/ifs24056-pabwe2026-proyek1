import { BookOpen, Bike, Headphones, Music, Package, Shirt, Sofa, Utensils } from "lucide-react";

const ICONS = { Fashion: Shirt, Elektronik: Headphones, Furniture: Sofa, Buku: BookOpen, Hobi: Music, Olahraga: Bike, "Rumah Tangga": Utensils };

export default function CategoryIcon({ category, size = 20 }) {
  const Icon = ICONS[category] || Package;
  return <Icon size={size} aria-hidden="true" />;
}
