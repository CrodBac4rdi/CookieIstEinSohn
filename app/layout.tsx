import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/app/dashboard/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B2B Lead CRM",
  description: "Sicheres B2B CRM Dashboard für Lead-Tracking und Outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}