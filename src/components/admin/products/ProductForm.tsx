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
import { CornerDownRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { useCategoryStore } from "@/store/category-store";
import { useProducts } from "@/hooks/useProducts";
import { Product, CreateProduct } from "@/types";
import { useProductFormStore } from "@/store/productform-store";

const formSchema = z.object({
  name: z.string().min(1, { message: "Namn på produkten krävs" }),
  description: z.string().optional(),
  categoryId: z.string().min(1, { message: "Kategori krävs" }),
});

type ProductFormProps = {
  product?: Product & { categoryId?: string };
  onSuccess?: (productId: string) => void;
  onVariantClick?: () => void;
};

export const ProductForm = ({
  product,
  onSuccess,
  onVariantClick,
}: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { createProduct, updateProduct, updateProductCategory } = useProducts();
  const { categories, getCategories, getChildCategories, getParentCategories } =
    useCategoryStore();
  const { setProductData, setProductId } = useProductFormStore();

  const parentCategories = getParentCategories();
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const isEditing = !!product;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      categoryId: product?.categoryId || "",
    },
    mode: "onSubmit",
  });

  const selectedCategoryId = form.watch("categoryId");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Step 1: Create/update product
      let productId = product?.id;
      if (isEditing && productId) {
        const productData: Product = {
          id: productId,
          name: values.name,
          description: values.description || "",
        };
        const result = await updateProduct(productData);
        if (!result.success) {
          throw new Error(result.error || "Failed to update product");
        }
      } else {
        const productData: CreateProduct = {
          name: values.name,
          description: values.description,
        };
        const result = await createProduct(productData);
        if (result.error) {
          throw new Error(result.error || "Failed to create product");
        }
        productId = result.id;
      }

      // Step 2: Handle categories
      if (productId) {
        setProductId(productId);
        const categoryResult = await updateProductCategory(
          productId,
          values.categoryId
        );
        if (!categoryResult.success) {
          throw new Error(
            categoryResult.error || "Failed to update category association"
          );
        }
      }

      // Success handling
      toast.success(isEditing ? "Product updated!" : "Product created!");

      if (productId && onSuccess) {
        onSuccess(productId);
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVariantClick = async () => {
    const isValid = await form.trigger();

    if (isValid) {
      const formValues = form.getValues();
      setProductData({
        name: formValues.name,
        description: formValues.description,
        categoryId: formValues.categoryId,
      });

      if (onVariantClick) {
        onVariantClick();
      }
    } else {
      toast.error("Vänligen åtgärda felen innan du fortsätter");
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
            render={({ field }) => {
              // Check if selected category is a child category
              const isChildCategory =
                selectedCategoryId &&
                categories.some(
                  (cat) => cat.id === selectedCategoryId && cat.parent_id
                );

              return (
                <FormItem>
                  <FormLabel>
                    Kategori
                    {!isChildCategory && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowCategoryModal(true);
                        }}
                        className="text-blue-600 hover:bg-transparent hover:text-blue-600 hover:cursor-pointer"
                      >
                        {selectedCategoryId
                          ? "+ Ny underkategori"
                          : "+ Ny kategori"}
                      </Button>
                    )}
                  </FormLabel>
                  <Select
                    key={categories.length}
                    value={field.value || ""}
                    onValueChange={(value) => {
                      if (value === "clear-option") {
                        field.onChange("");
                      } else {
                        field.onChange(value);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.value && (
                        <SelectItem
                          value="clear-option"
                          className="text-destructive"
                        >
                          -- Ta bort val --
                        </SelectItem>
                      )}
                      {parentCategories.map((parent) => (
                        <div key={parent.id}>
                          {/* Parent category */}
                          <SelectItem value={parent.id} className="font-medium">
                            {parent.name}
                          </SelectItem>

                          {/* Child categories - indented */}
                          {getChildCategories(parent.id).map((child) => (
                            <SelectItem
                              key={child.id}
                              value={child.id}
                              className="pl-6 text-sm border-gray-200"
                            >
                              <CornerDownRight />
                              {child.name}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          <div className="pt-4 flex justify-evenly">
            <Button type="submit" className="w-1/4" disabled={isSubmitting}>
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
            <Button
              type="button"
              className="w-1/4"
              onClick={handleVariantClick}
            >
              Lägg till variant
            </Button>
          </div>
        </form>
      </Form>
      <CategoryFormDialog
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        parentId={selectedCategoryId}
      />
    </Card>
  );
};
