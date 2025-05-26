"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/store/cart-store";
import { CartItemQuantity } from "@/components/common/CartItemQuantity";
import { removeCartItem } from "@/actions/cart";
import { toast } from "sonner";
export const CartButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCartStore();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

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
        useCartStore.getState().addItem(currentItem);
      } else {
        toast.success("Successfully removed item");
      }
    } catch (error) {
      toast.error("Something went wrong");
      useCartStore.getState().addItem(currentItem);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="cursor-pointer relative">
          <ShoppingCart className="size-6" />
          {items.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </div>
          )}
        </SheetTrigger>
        <SheetContent side="right" className="flex w-[600px]">
          <SheetHeader>
            <SheetTitle className="text-center">Varukorg</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1">
            {items &&
              items.map((product) => (
                <Card
                  key={product.id}
                  className="flex-row h-fit border-none shadow-none p-5 gap-2"
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
                      <CartItemQuantity item={product} />
                    </CardContent>
                  </div>
                </Card>
              ))}
          </ScrollArea>
          <div className="flex flex-col gap-5 mb-10">
            <Button className="bg-green-500">Gå till kassan</Button>
            <Button variant="outline">Fortsätt handla</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
