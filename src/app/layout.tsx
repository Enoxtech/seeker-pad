"use client";

import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/ui/PageTransition";
import { ThemeProvider } from "@/components/ThemeSwitch/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthContext";
import AIChatWidget from "@/components/AIChatWidget";
import { WalletProvider } from "@/components/wallet/WalletContext";

const WalletAdapterProvider = dynamic(
  () => import('@/components/wallet/WalletAdapterProvider').then(mod => mod.default),
  { ssr: false }
);

export const metadata = {
  title: "SeekerPad - Solana Mobile Launchpad",
  description: "The premier gateway for discovering and investing in the next generation of Solana Mobile projects",
  icons: {
    icon: "/favicon.ico",
  },
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  
  return (
    <div className={`animated-bg min-h-screen flex flex-col ${isAdmin ? 'bg-slate-900' : ''}`}>
      {!isAdmin && <Header />}
      <main className={`flex-1 ${isAdmin ? '' : 'pt-12'}`}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      {!isAdmin && <Footer />}
      <AIChatWidget />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen noise">
        <ThemeProvider>
          <WalletAdapterProvider>
            <WalletProvider>
              <AuthProvider>
                <LayoutContent>{children}</LayoutContent>
              </AuthProvider>
            </WalletProvider>
          </WalletAdapterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
