"use client";

import { useState, useEffect } from "react";
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
import { useColorStore } from "@/store/color-store";
import { ColorFormDialog } from "./ColorFormDialog";
import { useProducts } from "@/hooks/useProducts";
import { useProductFormStore } from "@/store/productform-store";

// Define schema for form validation
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

type VariantFormProps = {
  variant?: {
    id: string;
    color_id: string;
    price: string;
    stock: string;
    image_url?: string[];
  };
  onSuccess?: () => void;
};

export const VariantForm = ({ variant, onSuccess }: VariantFormProps) => {
  const {
    createProductVariant,
    updateProductVariant,
    createProduct,
    updateProductCategory,
    error,
    loading,
  } = useProducts();
  const { productData, isCreatingVariant, setProductId, productId } =
    useProductFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);

  console.log("ProductData: ", productData);
  const { colors, getColors } = useColorStore();

  // Initialize colors
  useEffect(() => {
    getColors();
  }, [getColors]);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Step 1: Create Product if necessary
      let currentProductId = productId;

      if (!currentProductId && productData && isCreatingVariant) {
        // We need to create the product first
        console.log("Creating product from stored data:", productData);

        if (!productData.name) {
          throw new Error("Product name is required");
        }

        const result = await createProduct({
          name: productData.name,
          description: productData.description,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create product");
        }

        currentProductId = result.id;

        if (!currentProductId) {
          throw new Error("Failed to get product ID after creation");
        }

        // Save the new ID in the store
        setProductId(currentProductId);

        // If we have a category, associate it
        if (productData.categoryId) {
          const categoryResult = await updateProductCategory(
            currentProductId,
            productData.categoryId
          );

          if (!categoryResult.success) {
            throw new Error(
              categoryResult.error || "Failed to update category association"
            );
          }
        }

        // Show success for product creation
        toast.success("Product created successfully!");
      }

      // Step 2: Verify we have a product ID
      if (!currentProductId) {
        toast.error("No product ID available. Please create a product first.");
        return;
      }

      // Step 3: Create/Update variant
      const variantData = {
        product_id: currentProductId,
        color_id: values.color_id,
        price: parseFloat(values.price),
        stock: parseInt(values.stock || "0"),
        image_url: values.image_url,
      };

      if (isEditing && variant?.id) {
        // Update existing variant
        const result = await updateProductVariant(variantData, variant.id);
        if (!result.success) {
          throw new Error(result.error || "Failed to update variant");
        }
        toast.success("Variant updated successfully");
      } else {
        // Create new variant
        const result = await createProductVariant(variantData);
        if (!result.success) {
          throw new Error(result.error || "Failed to create variant");
        }
        toast.success("Variant created successfully");
      }

      // Step 4: Success handling
      if (onSuccess) {
        onSuccess();
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
                    onClick={() => {
                      setShowColorModal(true);
                    }}
                    className="text-blue-600 hover:bg-transparent hover:text-blue-600 hover:cursor-pointer"
                  >
                    + Ny färg
                  </Button>
                </FormLabel>
                <Select
                  key={colors.length}
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
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
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
                <FormLabel>Lager</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
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
                <FormLabel>Produkt Bilder</FormLabel>
                <FormControl>
                  <div>
                    <ImagesUpload
                      productId={productId}
                      variantId={variant?.id}
                      currentImageUrls={field.value}
                      onImagesUpdated={handleImagesUpdated}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </form>
      </Form>
      <ColorFormDialog open={showColorModal} onOpenChange={setShowColorModal} />
    </Card>
  );
};
