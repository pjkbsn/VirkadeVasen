import { getCart } from "@/actions/cart";
import { CartItemList } from "@/components/cart/CartItemList";

export default async function CartPage() {
  const { data } = await getCart();

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1 className="font-semibold text-4xl p-5">Varukorg</h1>
      {data.length > 0 ? (
        <CartItemList productData={data} />
      ) : (
        <p>Din varukorg är tom</p>
      )}
    </div>
  );
}
