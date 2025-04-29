"use client";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEmailStore } from "@/store/email-store";
import { useAuthStore } from "@/store/auth-store";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email address is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Lösenord måste vara minst 6 tecken" })
      .regex(/[A-Z]/, {
        message: "Lösenord måste innehålla minst en stor bokstav",
      })
      .regex(/[a-z]/, {
        message: "Lösenord måste innehålla minst en liten bokstav",
      })
      .regex(/[0-9]/, { message: "Lösenord måste innehålla minst en siffra" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const { signUp, loading, error, success } = useAuthStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { email } = useEmailStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await signUp(values.email, values.password);
    if (!error) {
      console.log("Success", success);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <div className="h-3">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lösenord</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ange lösenord"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <div className="h-3">
                <FormMessage />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lösenordet måste innehålla minst 6 tecken, en stor bokstav, en
                liten bokstav och en siffra.
              </p>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bekräfta lösenord</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Bekräfta lösenord"
                  {...field}
                />
              </FormControl>
              <div className="h-3">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full hover:cursor-pointer"
          disabled={loading}
        >
          {loading ? "...Skapar konto" : "Skapa konto"}
        </Button>
        {error && error.length > 0 && (
          <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm mt-2">
            {error}
          </div>
        )}
      </form>
    </Form>
  );
}
