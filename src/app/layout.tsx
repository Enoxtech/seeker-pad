import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
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
    icon: "/seekers.png",
  },
};

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
                <div className="animated-bg min-h-screen flex flex-col">
                  <CollapsibleSidebar />
                  <div>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <AIChatWidget />
                </div>
              </AuthProvider>
            </WalletProvider>
          </WalletAdapterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
