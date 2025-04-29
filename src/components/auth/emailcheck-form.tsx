// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import { useEmailStore } from "@/store/email-store";
// import { useAuthStore } from "@/store/auth-store";

// const formSchema = z.object({
//   email: z
//     .string()
//     .min(1, { message: "Email address is required" })
//     .email({ message: "Invalid email address" }),
// });

// export default function EmailCheckForm() {
//   const { setEmail } = useEmailStore();
//   const { signIn, loading, setEmailExists } = useAuthStore();
//   const router = useRouter();
//   // const [isLoading, setIsLoading] = useState<boolean>(false);
//   // const [error, setError] = useState<string>("");

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setEmail(values.email);
//     const { error } = await signIn(values.email, "test-login");
//     if (error) {
//       console.log("Error on emailcheck: ", error);
//       if (error.toString().includes("Invalid login credentials")) {
//         setEmailExists(true);
//       }
//     } else {
//       router.push("/signup");
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="Email" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Logga in/Registrera</Button>
//       </form>
//     </Form>
//   );
// }
