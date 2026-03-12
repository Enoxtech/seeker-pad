import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from 'next/dynamic';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: "SeekerPad - Solana Mobile Launchpad",
  description: "The premier gateway for discovering and investing in the next generation of Solana Mobile projects",
  icons: {
    icon: "/favicon.ico",
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
