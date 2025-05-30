import type { Metadata } from "next";
import { Geist, Geist_Mono, Italianno } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/layout/conditional-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SuccessMessage } from "@/components/common/SuccessMessage";
import { Toaster } from "@/components/ui/sonner";
import ScrollbarWrapper from "@/components/layout/scrollbar-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const italianno = Italianno({
  variable: "--font-italianno",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virkadevasen",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${italianno.variable}`}
      // style={{ "--header-height": "80px" } as React.CSSProperties}
    >
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalHeader />
          <ScrollbarWrapper>
            {children}
            <SuccessMessage />
          </ScrollbarWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
