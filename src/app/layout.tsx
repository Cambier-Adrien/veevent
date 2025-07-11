import "./globals.scss";
import Header from "@/components/header/header";
import { CityProvider } from "@/contexts/city-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { ReactNode } from "react";
import FloatingMenu from "@/components/menu/floating-menu/floating-menu";
import { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth-context";
import { HeaderProvider } from "@/contexts/header-context";
import { FilterProvider } from "@/contexts/filter-context";
import HydrationFix from "@/components/commons/hydration-fix/hydration-fix";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent" as const,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f7",
  viewportFit: "cover" as const,
};

interface RootLayoutProps {
  children: ReactNode;
  sheet?: React.ReactNode;
}

export default function RootLayout({ children, sheet }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <HydrationFix />
        <AuthProvider>
          <FilterProvider>
            <HeaderProvider>
              <CityProvider>
                <SidebarProvider>
                  <Header />
                  {children}
                  {sheet}
                  <Footer />
                  <FloatingMenu />
                </SidebarProvider>
              </CityProvider>
            </HeaderProvider>
          </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
