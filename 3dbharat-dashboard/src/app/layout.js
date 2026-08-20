import "./globals.css";
import { Space_Grotesk, Inter } from "next/font/google";
import { Providers } from "./providers";
import { ThemeSync } from "@/components/layout/ThemeSync";
import { Navbar } from "@/components/layout/Navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata = {
  title: "3D Bharat | Investor Deal Platform",
  description:
    "Investor and corporate dashboard for exploring deals, tracking ROI, and managing investment interests.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head></head>
      <body className={`min-h-full flex flex-col antialiased ${spaceGrotesk.variable} ${inter.variable}`}>
        <Providers>
          <ThemeSync />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
            3D Bharat — simulated data, for demo purposes only.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
