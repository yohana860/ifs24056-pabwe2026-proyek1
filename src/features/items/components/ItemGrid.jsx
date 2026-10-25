import ItemCard from "./ItemCard";

export default function ItemGrid({ items, empty }) {
  if (!items.length) return <p className="py-10 text-ink2">{empty}</p>;
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6">
      {items.map((it) => <ItemCard key={it.id} item={it} />)}
    </div>
  );
}
