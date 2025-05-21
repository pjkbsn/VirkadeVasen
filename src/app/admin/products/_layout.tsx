// "use client";

// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { usePathname, useRouter } from "next/navigation";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathName = usePathname();
//   const router = useRouter();
//   console.log("Pathname: ", pathName);

//   const isNewProductRoute = pathName === "/admin/products/new";

//   const handleTabChange = (value: string) => {
//     if (value === "newproduct") {
//       router.push("/admin/products/new");
//     } else {
//       router.push("/admin/products");
//     }
//   };

//   return (
//     <main className="flex-1">
//       <Tabs
//         value={isNewProductRoute ? "newproduct" : "products"}
//         onValueChange={handleTabChange}
//       >
//         <TabsList className="w-3/4 mx-auto items-center">
//           <TabsTrigger value="products">Produkter</TabsTrigger>
//           <TabsTrigger value="newproduct">Ny produkt</TabsTrigger>
//         </TabsList>
//       </Tabs>
//       <div>{children}</div>
//     </main>
//   );
// }
