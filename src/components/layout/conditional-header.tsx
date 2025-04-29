"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Don't render anything on homepage
  if (isHomePage) {
    return null;
  }

  // Render header on all other pages
  return <Header />;
}
