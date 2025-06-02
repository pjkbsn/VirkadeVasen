"use client";

import { CartItemQuantity } from "@/components/common/CartItemQuantity";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Product } from "@/types";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { removeCartItem } from "@/actions/cart";

// type CartItemListProps = {
//   productData: {
//     quantity: number;
//     products: Product;
//   }[];
// };

export const CartItemList = (/* { productData }: CartItemListProps */) => {
  const { items } = useCartStore();

  // console.log(
  //   "ProductData: ",
  //   productData.map((item) => item.products.id)
  // );

  const handleDeleteItem = async (id: string) => {
    const currentItem = items.find((product) => product.id === id);
    console.log("currentItem", currentItem);
    console.log("currentItem", id);

    if (!currentItem) {
      toast.error("CurrentItem not found");
      return;
    }

    useCartStore.getState().removeItem(id);

    try {
      const result = await removeCartItem(id);
      if (!result.success) {
        toast.error("Failed to remove item");
      } else {
        toast.success("Successfully removed item");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Gör till komponent då liknande finns i CartButton.tsx */}
      <ScrollArea className="flex-1 overflow-y-auto w-2/5">
        {items &&
          items.map((product) => (
            <Card
              key={product.id}
              className="flex-row h-fit shadow-none p-5 gap-2 bg-background border-b-1 border-t-0 border-r-0 border-l-0 rounded-none border-b-border"
            >
              <Image
                src={product.image}
                alt={"Produktbild"}
                height="250"
                width="150"
                // fill
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                // className="object-contain"
              />
              <div className="flex flex-col w-full gap-0 p-0">
                <CardHeader className="w-full h-full p-0 gap-5 flex flex-col">
                  <div className="flex justify-between w-full items-center">
                    <CardTitle>{product.name}</CardTitle>
                    <Button
                      variant="ghost"
                      className=" cursor-pointer"
                      onClick={() => handleDeleteItem(product.id)}
                    >
                      X
                    </Button>
                  </div>
                  <CardDescription>
                    Pris: {product.price}kr <br /> Färg: {product.color}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <CartItemQuantity
                    item={{
                      id: product.id,
                      quantity: product.quantity,
                    }}
                  />
                </CardContent>
              </div>
            </Card>
          ))}
      </ScrollArea>
    </div>
  );
};
