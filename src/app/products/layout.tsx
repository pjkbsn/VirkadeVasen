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
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-3">Kategorier</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Alla produkter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Kategori 1
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Kategori 2
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Kategori 3
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-3">Filter</h2>
            {/* Add filters here as needed */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Filter option 1</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Filter option 2</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Filter option 3</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main content area where products will be displayed */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
