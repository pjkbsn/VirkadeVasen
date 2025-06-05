"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/actions/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Category } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, { message: "Kategorinamn krävs" }),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormProps = {
  parentId?: string;
  onSuccess: (category: Category) => void; // Return the created category
};

export const CategoryForm = ({ parentId, onSuccess }: CategoryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      parentId: parentId || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const selectedParentId = parentId ? parentId : values.parentId;

      // The form handles its own API calls
      const result = await createCategory({
        name: values.name,
        description: values.description,
        parent_id: selectedParentId,
      });

      if (result.success && result.id) {
        // Create a complete category object
        const newCategory: Category = {
          id: result.id,
          name: values.name,
          description: values.description || "",
          parent_id: selectedParentId,
          slug: values.name.toLowerCase().replace(/\s+/g, "-"),
        };

        toast.success(
          `${parentId ? "Underkategori" : "Kategori"} '${
            values.name
          }' har skapats`
        );

        form.reset();
        onSuccess(newCategory); // Pass the new category to parent
      } else {
        toast.error(result.error || "Kunde inte skapa kategori");
      }
    } catch (error) {
      console.error("Failed to add category: ", error);
      toast.error("Kunde inte skapa kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form rendering stays the same
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields remain unchanged */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {parentId ? "Lägg till underkategori" : "Lägg till ny kategori"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    parentId ? "Underkategori..." : "Kategorinamn..."
                  }
                  type="text"
                  {...field}
                />
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
              <FormLabel>Beskrivning (valfritt)</FormLabel>
              <FormControl>
                <Input placeholder="Kort beskrivning" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Skapar...
            </>
          ) : parentId ? (
            "Skapa underkategori"
          ) : (
            "Skapa kategori"
          )}
        </Button>
      </form>
    </Form>
  );
};
