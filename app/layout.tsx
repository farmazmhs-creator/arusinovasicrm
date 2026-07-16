import type { Metadata } from "next";
import "./globals.css";
import TopNav from "./components/TopNav";
import { getCurrentUser } from "@/lib/auth/middleware";

export const metadata: Metadata = {
  title: "ArusInovasi CRM",
  description: "Medical device quotation and operations management",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="antialiased">
        {user && <TopNav />}
        {children}
      </body>
    </html>
  );
}
