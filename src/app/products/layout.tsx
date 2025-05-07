import { ProductFilter } from "@/components/products/ProductFilter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produkter | Virkade Väsen",
  description: "Utforska vårt sortiment av handgjorda produkter",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Våra produkter</h1>
        <p className="text-gray-600">
          Utforska vårt sortiment av handgjorda produkter skapade med omsorg och
          kärlek.
        </p>
      </div>

      {/* Filter/category sidebar and product content area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-6">
          <ProductFilter />
        </aside>

        {/* Main content area where products will be displayed */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
