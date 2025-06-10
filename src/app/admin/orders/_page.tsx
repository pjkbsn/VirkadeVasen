// import { getProductGroups } from "@/actions/products";

export default async function OrderPage() {
  // const { success, data: serverProducts, error } = await getProductGroups();

  // console.log("Fetched Serverproducts: ", serverProducts);
  return (
    <div className="mx-auto p-6">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold mb-8">Beställningar</h1>
      </div>

      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-6">Alla beställningar</h2>
        </div>
      </div>
    </div>
  );
}
