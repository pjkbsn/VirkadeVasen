import { useCartStore } from "@/store/cart-store";
import { Button } from "../ui/button";
import { updateCartItemQuantity } from "@/actions/cart";
import { toast } from "sonner";

type CartItemQuantityProps = {
  item: {
    id: string;
    quantity: number;
  };
};

export const CartItemQuantity = ({ item }: CartItemQuantityProps) => {
  const { updateQuantity } = useCartStore();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    const prevQuantity = item.quantity;
    updateQuantity(item.id, newQuantity);

    try {
      const result = await updateCartItemQuantity({
        id: item.id,
        quantity: newQuantity,
      });

      if (!result.success) {
        updateQuantity(item.id, prevQuantity);
        toast.error(result.error || "Failed to update quantity");
      }
    } catch (error) {
      updateQuantity(item.id, prevQuantity);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex gap-5 items-center">
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => handleQuantityChange(item.quantity - 1)}
        disabled={item.quantity <= 1}
      >
        -
      </Button>
      <p>{item.quantity}</p>
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => handleQuantityChange(item.quantity + 1)}
      >
        +
      </Button>
    </div>
  );
};
