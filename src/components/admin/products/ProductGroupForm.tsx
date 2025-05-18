// src/components/admin/products/ProductGroupForm.tsx
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
import { Category, ProductGroups } from "@/types";
import {
  createProductGroup,
  updateProductGroup,
  updateProductCategory,
} from "@/actions/products";

const formSchema = z.object({
  name: z.string().min(1, { message: "Produktgruppnamn krävs" }),
  description: z.string().optional(),
  categoryId: z.string().min(1, { message: "Kategori krävs" }),
});

type ProductGroupFormProps = {
  productGroup?: ProductGroups & { categoryId?: string };
  initialCategories: Category[];
  onSuccess: (id: string) => void;
  onVariantClick: () => void;
};

export const ProductGroupForm = ({
  productGroup,
  initialCategories,
  onSuccess,
  onVariantClick,
}: ProductGroupFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const isEditing = !!productGroup;

  // Group categories by parent/child
  const parentCategories = categories.filter((cat) => !cat.parent_id);
  const getChildCategories = (parentId: string) =>
    categories.filter((cat) => cat.parent_id === parentId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: productGroup?.name || "",
      description: productGroup?.description || "",
      categoryId: productGroup?.categoryId || "",
    },
    mode: "onSubmit",
  });

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
    // form.setValue("categoryId", newCategory.id);
  };

  const selectedCategoryId = form.watch("categoryId");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Step 1: Create/update product group
      let productGroupId = productGroup?.id;

      if (isEditing && productGroupId) {
        const result = await updateProductGroup({
          id: productGroupId,
          name: values.name,
          description: values.description || "",
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to update product group");
        }
      } else {
        const result = await createProductGroup({
          name: values.name,
          description: values.description,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create product group");
        }
        productGroupId = result.id;
      }

      // Step 2: Handle categories
      if (productGroupId && values.categoryId) {
        const categoryResult = await updateProductCategory(
          productGroupId,
          values.categoryId
        );

        if (!categoryResult.success) {
          throw new Error(
            categoryResult.error || "Failed to update category association"
          );
        }
      }

      // Success handling
      toast.success(
        isEditing ? "Produktgrupp uppdaterad!" : "Produktgrupp skapad!"
      );

      if (productGroupId && onSuccess) {
        onSuccess(productGroupId);

        onVariantClick();
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Något gick fel. Försök igen.");
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
                <FormLabel>Namn</FormLabel>
                <FormControl>
                  <Input placeholder="Produktnamn" {...field} />
                </FormControl>
                <FormMessage />
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
                    placeholder="Produktbeskrivning"
                    className="resize-none"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>Kategori</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCategoryModal(true)}
                    className="text-blue-600 hover:bg-transparent hover:text-blue-600 hover:cursor-pointer"
                  >
                    {selectedCategoryId
                      ? "+ Ny underkategori"
                      : "+ Ny kategori"}
                  </Button>
                </FormLabel>
                <Select
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
                            className="pl-6 text-sm border-l border-gray-200"
                          >
                            <CornerDownRight className="mr-1 h-4 w-4" />
                            {child.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-center">
            <Button type="submit" className="w-1/2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Uppdaterar..." : "Skapar..."}
                </>
              ) : isEditing ? (
                "Uppdatera produktgrupp"
              ) : (
                "Nästa"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <CategoryFormDialog
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        parentId={selectedCategoryId}
        onCategoryCreated={handleCategoryCreated}
      />
    </Card>
  );
};
