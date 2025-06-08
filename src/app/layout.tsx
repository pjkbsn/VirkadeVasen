import type { Metadata } from "next";
import { Geist, Geist_Mono, Italianno } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/layout/conditional-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SuccessMessage } from "@/components/common/SuccessMessage";
import { Toaster } from "@/components/ui/sonner";
import ScrollbarWrapper from "@/components/layout/scrollbar-wrapper";
import { CartProvider } from "@/providers/CartProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { getCurrentUser } from "@/lib/auth";

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

export const metadata = {
  title: "VirkadeVäsen",
  description: "Handgjorda virkade väsen",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getCurrentUser();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${italianno.variable}`}
      // style={{ "--header-height": "80px" } as React.CSSProperties}
    >
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider initialUser={initialUser}>
            <CartProvider>
              <ConditionalHeader />
              <ScrollbarWrapper>
                {children}
                <SuccessMessage />
              </ScrollbarWrapper>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
