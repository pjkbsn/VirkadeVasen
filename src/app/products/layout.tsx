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
      {/* Main content area where products will be displayed */}
      <main className="md:col-span-3">{children}</main>
    </div>
  );
}
