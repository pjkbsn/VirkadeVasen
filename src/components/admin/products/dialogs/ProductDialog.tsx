"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductGroups, Color } from "@/types";
import { ProductForm } from "../forms/ProductForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

type AddProductDialogProps = {
  productGroups: ProductGroups[];
  colors: Color[];
  children: React.ReactNode;
};

export function ProductDialog({
  productGroups,
  colors,
  children,
}: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Get the selected product group if any
  const selectedProductGroup = selectedProductId
    ? productGroups.find((pg) => pg.id === selectedProductId)
    : undefined;

  const handleSuccess = () => {
    toast.success("Produkt skapad!");
    // Optional: close the dialog
    // setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset selection when dialog closes
      setTimeout(() => setSelectedProductId(""), 300);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Lägg till produkt</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Card className="p-4 mb-4">
            <label className="block text-sm font-medium mb-2">
              Välj produktgrupp
            </label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj produktgrupp" />
              </SelectTrigger>
              <SelectContent>
                {productGroups.map((pg) => (
                  <SelectItem key={pg.id} value={pg.id}>
                    {pg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {selectedProductId && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-4">
                Lägg till produkt för {selectedProductGroup?.name}
              </h3>
              <ProductForm
                productId={selectedProductId}
                initialColors={colors}
                onSuccess={handleSuccess}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
