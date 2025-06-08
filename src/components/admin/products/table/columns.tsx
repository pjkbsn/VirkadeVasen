"use client";

import { Color, Product } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Trash, Edit } from "lucide-react";
import { deleteProduct } from "@/actions/products";
import { useState } from "react";
import { toast } from "sonner";
import { EditProductDialog } from "../dialogs/EditProductDialog";
import { useRouter } from "next/navigation";

export const columns = (availableColors: Color[]): ColumnDef<Product>[] => [
  {
    accessorFn: (row) => row.product_groups.name,
    id: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Namn
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.original.product_groups.name}</div>,
  },
  {
    accessorFn: (row) => row.colors.name,
    id: "color",
    header: "Färg",
    cell: ({ row }) => <div>{row.original.colors.name}</div>,
  },
  {
    accessorKey: "stock",
    header: "Antal",
    cell: ({ row }) => <div>{row.original.stock || 0}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pris
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.original.price} kr</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <ProductActionsCell
            product={product}
            availableColors={availableColors}
          />
        </div>
      );
    },
  },
];

// Separate client component for actions with state
const ProductActionsCell = ({
  product,
  availableColors,
}: {
  product: Product;
  availableColors: Color[];
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      confirm(
        `Är du säker på att du vill ta bort ${product.product_groups.name}?`
      )
    ) {
      setIsDeleting(true);
      try {
        const result = await deleteProduct(product.id);
        if (result.success) {
          toast.success("Produkten har tagits bort");
        } else {
          toast.error("Något gick fel: " + result.error);
        }
      } catch (error: unknown) {
        toast.error("Ett fel uppstod");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <EditProductDialog
        product={product}
        colors={availableColors}
        onSuccess={() => router.refresh()}
      >
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </EditProductDialog>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};
