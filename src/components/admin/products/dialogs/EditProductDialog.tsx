"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product, Color } from "@/types";
import { toast } from "sonner";
import { ProductForm } from "../forms/ProductForm";

type EditProductDialogProps = {
  product: Product;
  colors: Color[];
  children: React.ReactNode;
  onSuccess?: () => void;
};

export function EditProductDialog({
  product,
  colors,
  children,
  onSuccess,
}: EditProductDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    toast.success("Product updated successfully!");
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  const transformedVariant = {
    id: product.id,
    color_id: product.colors.id ?? "", // Extract color_id from the nested colors object
    price: product.price.toString(),
    stock: product.stock ? product.stock.toString() : "0",
    image_url: product.image_url,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.product_groups.name}</DialogTitle>
        </DialogHeader>

        <ProductForm
          productId={product.product_groups.id}
          initialColors={colors}
          variant={transformedVariant}
          onSuccess={handleSuccess}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
}
