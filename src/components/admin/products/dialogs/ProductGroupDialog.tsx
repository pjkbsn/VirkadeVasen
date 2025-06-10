"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGroupForm } from "../forms/ProductGroupForm";
import { ProductForm } from "../forms/ProductForm";
import { ProductGroups, Category, Color } from "@/types";
import { toast } from "sonner";
import { deleteProductGroup } from "@/actions/products";

type ProductGroupDialogProps = {
  productGroups: ProductGroups[];
  categories: Category[];
  colors: Color[];
  children: React.ReactNode;
};

export function ProductGroupDialog({
  productGroups,
  categories,
  colors,
  children,
}: ProductGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("product");

  // Find the created product group if any
  const createdProductGroup = createdProductId
    ? productGroups.find((pg) => pg.id === createdProductId)
    : undefined;

  console.log("Skapad produktgrupp: ", createdProductGroup);

  const handleProductGroupSuccess = (productId: string) => {
    setCreatedProductId(productId);
    setActiveTab("variant");
  };

  const handleVariantSuccess = () => {
    setCreatedProductId("");
    toast.success("Variant skapad!");
  };

  const handleOpenChange = (newOpen: boolean) => {
    /* Om dialogen stängs under processen */
    if (!newOpen) {
      /* Om produktgrupp skapats men ingen variant */
      if (createdProductId && activeTab === "variant") {
        /* Ta bort produktgruppen */
        deleteProductGroup(createdProductId)
          .then(() => {
            toast.info("Produktskapande avbrutet");
          })
          .catch(() => {
            toast.error("Kunde inte ta bort produktgrupp");
          });
      }
      /* Återställ state när dialogen stängs */
      setTimeout(() => {
        setCreatedProductId("");
        setActiveTab("product");
      }, 300);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {activeTab === "product"
              ? "Skapa produktgrupp"
              : "Lägg till variant"}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "product"
              ? "Fyll i information om produktgruppen."
              : "Lägg till en variant för produktgruppen."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="product">Produktgrupp</TabsTrigger>
            <TabsTrigger value="variant" disabled={!createdProductId}>
              Variant
            </TabsTrigger>
          </TabsList>

          {/* Steg 1: Produktgrupp */}
          <TabsContent value="product" className="mt-4">
            <ProductGroupForm
              initialCategories={categories}
              onSuccess={handleProductGroupSuccess}
            />
          </TabsContent>

          {/* Steg 2: Produkt/variant */}
          <TabsContent value="variant" className="mt-4">
            {createdProductId && (
              <ProductForm
                productId={createdProductId}
                initialColors={colors}
                onSuccess={() => {
                  handleVariantSuccess();
                  setOpen(false);
                }}
                onAbort={() => {
                  handleOpenChange(false);
                }}
                newProduct={true}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
