import { ShoppingCart } from "lucide-react";
import { Button } from "../../ui/button";

export const CartButton = () => {
  return (
    <div>
      <Button
        size="lg"
        className="cursor-pointer flex flex-col items-center bg-transparent hover:bg-transparent hover:underline"
      >
        <ShoppingCart className="h-12 w-12" />
        Varukorg
      </Button>
    </div>
  );
};
