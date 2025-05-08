import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  colorName?: string;
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  colorName,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt={`${name} - ${colorName || ""}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium">Namn: {name}</h3>
          {colorName && (
            <p className="text-sm text-gray-500">Color: {colorName}</p>
          )}
          <p className="font-bold mt-2">{price} kr</p>
        </div>
      </div>
    </Link>
  );
}
