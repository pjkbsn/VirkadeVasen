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
import { useCategoryStore } from "@/store/category-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Kategorinamn krävs" }),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormProps = {
  parentId?: string;
  onSuccess: () => void;
};

export const CategoryForm = ({ parentId, onSuccess }: CategoryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCategory } = useCategoryStore();

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

      const result = await addCategory(
        values.name,
        values.description,
        selectedParentId
      );
      if (result) {
        toast.success(
          `${parentId ? "Underkategori" : "Kategori"}'${
            values.name
          }' har skapats`
        );
        form.reset({
          name: "",
          description: "",
          parentId: parentId || undefined,
        });
      }
    } catch (error) {
      console.error("Failed to add category: ", error);
      toast.error("Kunde inte skapa kategori");
    } finally {
      setIsSubmitting(false);
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
