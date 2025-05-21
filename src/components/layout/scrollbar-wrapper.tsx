"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "";

  useEffect(() => {
    // Apply the appropriate class to the body
    if (isHomePage) {
      document.body.classList.remove("show-scrollbar");
    } else {
      document.body.classList.add("show-scrollbar");
    }

    // Clean up when component unmounts
    return () => {
      document.body.classList.remove("show-scrollbar");
    };
  }, [isHomePage]);

  return <main className="flex-1">{children}</main>;
}
