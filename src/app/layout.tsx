import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeSwitch/ThemeProvider";

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
          <div className="animated-bg min-h-screen">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white">
              SP
            </div>
            <span className="text-gray-500">© 2025 SeekerPad</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">Terms</a>
            <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">Discord</a>
            <a href="#" className="text-gray-500 hover:text-purple-400 transition-colors text-sm">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
