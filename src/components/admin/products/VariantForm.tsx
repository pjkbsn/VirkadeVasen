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
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImagesUpload } from "./ImagesUpload";
import { useColorStore } from "@/store/color-store";

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

type Color = {
  id: string;
  name: string;
  hex_code?: string;
};

type VariantFormProps = {
  productId: string;
  variant?: {
    id: string;
    color_id: string;
    price: string;
    stock: string;
    image_url?: string[];
  };
  onSuccess?: () => void;
};

export const VariantForm = ({
  productId,
  variant,
  onSuccess,
}: VariantFormProps) => {
  // const [colors, setColors] = useState<Color[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Fetch colors on component mount
  // useEffect(() => {
  //   const fetchColors = async () => {
  //     const supabase = createClient();

  //     try {
  //       const { data: colorsData, error: colorsError } = await supabase
  //         .from("colors")
  //         .select("id, name, hex_code")
  //         .order("name");

  //       if (colorsError) throw colorsError;
  //       setColors(colorsData || []);
  //     } catch (error: any) {
  //       console.error("Error fetching colors:", error);
  //       toast.error("Failed to load colors");
  //     }
  //   };

  //   fetchColors();
  // }, []);

  const handleImagesUpdated = (urls: string[]) => {
    form.setValue("image_url", urls);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!productId) {
      toast.error("No product ID provided");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const variantData = {
        product_id: productId,
        color_id: values.color_id,
        price: parseFloat(values.price),
        stock: parseInt(values.stock || "0"),
        image_url: values.image_url,
      };

      if (isEditing && variant?.id) {
        // Update existing variant
        const { error } = await supabase
          .from("product_variants")
          .update(variantData)
          .eq("id", variant.id);

        if (error) throw error;
        toast.success("Variant updated");
      } else {
        // Create new variant
        const { error } = await supabase
          .from("product_variants")
          .insert(variantData);

        if (error) throw error;
        toast.success("Variant created");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/admin/products/${productId}`);
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
                <FormLabel>Färg</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                          {color.hex_code && (
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.hex_code }}
                            />
                          )}
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

          <div className="space-y-2">
            <FormLabel>Product Images</FormLabel>
            <ImagesUpload
              productId={productId}
              variantId={variant?.id}
              currentImageUrls={form.getValues().image_url}
              onImagesUpdated={handleImagesUpdated}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
    </Card>
  );
};
