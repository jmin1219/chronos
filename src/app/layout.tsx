import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "../components/QueryProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chronos",
  description: "AI-Powered Personal Productivity Coach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Cannot directly implement QueryClientProvider here because this file (layou.tsx) is a server component. */}
        <QueryProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">{children}</main>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
