// src/components/admin/products/ColorForm.tsx
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
import { toast } from "sonner";
import { createColor } from "@/actions/colors";
import { HexColorPicker } from "react-colorful";
import { Color } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, { message: "Färgnamn krävs" }),
  hex_code: z.string().min(1, { message: "Färgkod krävs" }),
});

type ColorFormProps = {
  onSuccess: (color: Color) => void;
};

export const ColorForm = ({ onSuccess }: ColorFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hex_code: "#000000",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Use the callback if provided
      const result = await createColor({
        name: values.name,
        hex_code: values.hex_code,
      });
      if (result.success && result.id) {
        const newColor: Color = {
          id: result.id,
          name: values.name,
          hex_code: values.hex_code,
        };

        toast.success(`Färg '${values.name}' har skapats`);
        form.reset();
        onSuccess(newColor);
      } else {
        toast.error("Kunde inte skapa färg");
      }
    } catch (error) {
      console.error("Failed to add color: ", error);
      toast.error("Ett fel uppstod när färgen skulle skapas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Namn</FormLabel>
              <FormControl>
                <Input placeholder="Färgnamn..." type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hex_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Färgkod</FormLabel>
              <HexColorPicker color={field.value} onChange={field.onChange} />
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Lägger till..." : "Lägg till färg"}
        </Button>
      </form>
    </Form>
  );
};
