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
import { useColorStore } from "@/store/color-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { HexColorPicker } from "react-colorful";

const formSchema = z.object({
  name: z.string().min(1, { message: "Färgnamn krävs" }),
  hex_code: z.string().min(1, { message: "Färgkod krävs" }),
});

type ColorFormProps = {
  onSuccess: () => void;
};

export const ColorForm = ({ onSuccess }: ColorFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addColor } = useColorStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hex_code: "#ffffff",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await addColor(values.name, values.hex_code);
      if (result) {
        toast.success(`Färg ${values.name} har lagts till`);
        form.reset({
          name: "",
          hex_code: "#ffffff",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to add color: ", error);
      toast.error("Kunde inte lägga till färg");
    } finally {
      setIsSubmitting(false);
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
