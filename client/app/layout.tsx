import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import '@/styles/globals.css';
import ClientOnly from "@/components/ClientOnly";
import Login from "@/components/MapComponent";
import Hero from "@/app/hero/Hero";
import getCurrentUser from "@/services/getCurrentUser";

const font = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adventure Atlas",
  description: "New journaling app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <Navbar /> 
        </ClientOnly>
        {children}
        <Footer />
      </body>
    </html>
  );
}
