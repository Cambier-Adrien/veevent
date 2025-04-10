"use client";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { CityProvider } from "@/contexts/city-context";
import ScrollToTop from "@/components/scroll-to-top";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <CityProvider>
            <ScrollToTop />
            <Header />
            {children}
            <Footer />
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
