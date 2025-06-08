import { CartItemList } from "@/components/cart/CartItemList";

export default async function CartPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1 className="font-semibold text-4xl p-5">Varukorg</h1>
      <CartItemList />
    </div>
  );
}
