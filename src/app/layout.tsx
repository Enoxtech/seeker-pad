import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeSwitch/ThemeProvider";

const WalletAdapterProvider = dynamic(
  () => import('@/components/wallet/WalletAdapterProvider').then(mod => mod.default),
  { ssr: false }
);

export const metadata = {
  title: "SeekerPad - Solana Mobile Launchpad",
  description: "The premier gateway for discovering and investing in the next generation of Solana Mobile projects",
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
            <div className="animated-bg min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </WalletAdapterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
