// src/components/admin/products/ProductForm.tsx (VariantForm)
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImagesUpload } from "./ImagesUpload";
import { ColorFormDialog } from "./ColorFormDialog";
import { Color } from "@/types";
import { createProduct, updateProduct } from "@/actions/products";
import { createColor } from "@/actions/colors";

// Schema definition remains the same
const formSchema = z.object({
  color_id: z.string().min(1, { message: "Färg krävs" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Pris måste vara ett positivt nummer",
  }),
  stock: z
    .string()
    .optional()
    .transform((val) => (val === "" ? "0" : val)),
  image_url: z.string().array().optional(),
});

type ProductFormProps = {
  variant?: {
    id: string;
    color_id: string;
    price: string;
    stock: string;
    image_url?: string[];
  };
  productId?: string;
  initialColors: Color[];
  onSuccess?: () => void;
  newProduct?: boolean;
  onAbort?: () => void;
};

export const ProductForm = ({
  variant,
  productId,
  initialColors,
  onSuccess,
  newProduct,
  onAbort,
}: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [colors, setColors] = useState<Color[]>(initialColors);
  const [resetKey, setResetKey] = useState(0);
  const router = useRouter();
  const isEditing = !!variant;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color_id: variant?.color_id || "",
      price: variant?.price || "",
      stock: variant?.stock || "0",
      image_url: Array.isArray(variant?.image_url) ? variant.image_url : [],
    },
  });

  const handleImagesUpdated = (urls: string[]) => {
    form.setValue("image_url", urls);
  };

  const handleColorCreated = (newColor: Color) => {
    setColors((prev) => [...prev, newColor]);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Verify we have a product ID
      if (!productId) {
        toast.error("No product ID available. Please create a product first.");
        return;
      }

      // Create variant data
      const variantData = {
        product_groups_id: productId,
        color_id: values.color_id,
        price: parseFloat(values.price),
        stock: parseInt(values.stock || "0"),
        image_url: values.image_url,
      };

      // Create or update the variant
      if (isEditing && variant?.id) {
        const result = await updateProduct(variantData, variant.id);
        if (!result.success) {
          throw new Error(result.error || "Failed to update variant");
        }
        toast.success("Variant updated successfully");
      } else {
        const result = await createProduct(variantData);
        if (!result.success) {
          throw new Error(result.error || "Failed to create variant");
        }
        toast.success("Variant created successfully");
      }

      // Handle success
      if (onSuccess) {
        onSuccess();
        form.reset();
        setResetKey((prev) => prev + 1);
      } else {
        router.push(`/admin/products`);
      }
    } catch (error: any) {
      console.error("Error submitting variant:", error);
      toast.error(error.message || "Failed to save variant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="color_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Färg
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowColorModal(true)}
                    className="text-blue-600 hover:bg-transparent hover:text-blue-600 hover:cursor-pointer"
                  >
                    + Ny färg
                  </Button>
                </FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj färg" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.hex_code }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pris (kr)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="399"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lagersaldo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bilder</FormLabel>
                <FormControl>
                  <ImagesUpload
                    key={resetKey}
                    productId={productId}
                    variantId={variant?.id}
                    currentImageUrls={field.value || []}
                    onImagesUpdated={handleImagesUpdated}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Uppdaterar..." : "Skapar..."}
                </>
              ) : isEditing ? (
                "Uppdatera variant"
              ) : (
                "Skapa variant"
              )}
            </Button>
            {newProduct && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  if (onAbort) onAbort();
                }}
              >
                Avbryt
              </Button>
            )}
          </div>
        </form>
      </Form>
      <ColorFormDialog
        open={showColorModal}
        onOpenChange={setShowColorModal}
        onColorCreated={handleColorCreated}
      />
    </Card>
  );
};
