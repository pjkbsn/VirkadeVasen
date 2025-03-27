"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ConditionalHeader() {
  const pathname = usePathname();
  //   const isHomePage = pathname === "/";

  // Debug - remove this later
  console.log("Current pathname:", pathname);
  //   console.log("Is homepage?", isHomePage);

  //   if (isHomePage) {
  //     return null;
  //   }

  return (
    <header className="bg-slate-800 p-4 text-white">
      <nav className="flex gap-4">
        <Link href="/" className="hover:text-blue-300">
          Home
        </Link>
        <Link href="/secondpage" className="hover:text-blue-300">
          Second Page
        </Link>
        {/* Other navigation items */}
      </nav>
    </header>
  );
}
