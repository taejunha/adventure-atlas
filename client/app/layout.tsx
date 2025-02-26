import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Navbar from "@/components/Navbar";
import Provider from "@/app/providers/SessionProvider";
import Footer from "@/components/Footer";
import '@/styles/globals.css';
import getCurrentUser from "@/services/getCurrentUser";
import LocationModal from "@/components/modals/LocationModal";

const font = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adventure Atlas",
  description: "New journaling app",
};

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <Provider>
          <Navbar currentUser={currentUser} /> 
          <LocationModal />
        </Provider>
        {children}
        <Footer />
      </body>
    </html>
  );
}
