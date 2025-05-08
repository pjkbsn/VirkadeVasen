"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const variantSchema = z.object({
  color_id: z.string().min(1, { message: "Färg krävs" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Pris måste vara ett positivt nummer",
  }),
  stock: z
    .string()
    .optional()
    .transform((val) => (val === "" ? "0" : val)),
});

const formSchema = z.object({
  name: z.string().min(1, { message: "Namn på produkten krävs" }),
  description: z.string().optional(),
  categoryId: z.string().min(1, { message: "Kategori krävs" }),
  variants: z
    .array(variantSchema)
    .min(1, { message: "Minst en variant krävs" }),
});

type ProductFormProps = {
  product?: {
    id: string;
    name: string;
    description?: string;
    categoryId?: string;
    variants?: {
      id: string;
      color_id: string;
      price: string;
      stock: string;
    }[];
  };
  onSuccess?: (productId: string | undefined) => void;
};

type Category = {
  id: string;
  name: string;
};

type Color = {
  id: string;
  name: string;
  hex_code?: string;
};

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isEditing = !!product;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      categoryId: product?.categoryId || "",
      variants:
        product?.variants && product?.variants?.length > 0
          ? product.variants
          : [{ color_id: "", price: "", stock: "0" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "variants",
    control: form.control,
  });

  // Fetch categories and colors on component mount
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("id, name")
          .order("name");

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch colors
        const { data: colorsData, error: colorsError } = await supabase
          .from("colors")
          .select("id, name, hex_code")
          .order("display_order");

        if (colorsError) throw colorsError;
        setColors(colorsData || []);
      } catch (error: any) {
        console.error("Error fetching form data:", error);
        toast.error("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Step 1: Create/update product
      let productId = product?.id;
      let productResult;

      if (isEditing && productId) {
        productResult = await supabase
          .from("products")
          .update({
            name: values.name,
            description: values.description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", productId)
          .select()
          .single();
      } else {
        productResult = await supabase
          .from("products")
          .insert({
            name: values.name,
            description: values.description,
          })
          .select()
          .single();
      }

      if (productResult.error) {
        console.error("Product error:", productResult.error);
        throw new Error(`Product error: ${productResult.error.message}`);
      }

      productId = productResult.data.id;

      // Step 2: Handle categories
      try {
        if (isEditing) {
          const { error: deleteError } = await supabase
            .from("product_categories")
            .delete()
            .eq("product_id", productId);

          if (deleteError) throw deleteError;
        }

        const { error: categoryError } = await supabase
          .from("product_categories")
          .insert({
            product_id: productId,
            category_id: values.categoryId,
          });

        if (categoryError) throw categoryError;
      } catch (catError: any) {
        console.error("Category association error:", catError);
        throw new Error(`Category association error: ${catError.message}`);
      }

      // Step 3: Handle variants
      try {
        if (isEditing) {
          const { error: deleteVariantsError } = await supabase
            .from("product_variants")
            .delete()
            .eq("product_id", productId);

          if (deleteVariantsError) throw deleteVariantsError;
        }

        const variantsToInsert = values.variants.map((variant) => ({
          product_id: productId,
          color_id: variant.color_id,
          price: parseFloat(variant.price),
          stock: parseInt(variant.stock || "0"),
        }));

        const { error: variantsError } = await supabase
          .from("product_variants")
          .insert(variantsToInsert);

        if (variantsError) throw variantsError;
      } catch (varError: any) {
        console.error("Variant error:", varError);
        throw new Error(`Variant error: ${varError.message}`);
      }

      toast.success(isEditing ? "Product updated!" : "Product created!");

      if (productId && onSuccess) {
        onSuccess(productId);
      } else {
        router.push(`/admin/products`);
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Namn på produkt</FormLabel>
                <FormControl>
                  <Input placeholder="Namn på din produkt..." {...field} />
                </FormControl>
                <div className="h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beskrivning</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Beskriv din produkt..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <div className="h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Produktvarianter</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ color_id: "", price: "", stock: "0" })}
              >
                <Plus className="h-4 w-4 mr-1" /> Lägg till variant
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 mb-4 bg-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Ta bort
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.color_id`}
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
                                      style={{
                                        backgroundColor: color.hex_code,
                                      }}
                                    />
                                  )}
                                  {color.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="h-5">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.price`}
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
                        <div className="h-5">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.stock`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lager</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-5">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            {form.formState.errors.variants?.message && (
              <p className="text-sm font-medium text-destructive mt-2">
                {form.formState.errors.variants.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Uppdaterar..." : "Skapar..."}
                </>
              ) : isEditing ? (
                "Uppdatera produkt"
              ) : (
                "Skapa produkt"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
