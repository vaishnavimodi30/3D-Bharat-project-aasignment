import "./globals.css";
import { Providers } from "./providers";
import { ThemeSync } from "@/components/layout/ThemeSync";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "3D Bharat | Investor Deal Platform",
  description:
    "Investor and corporate dashboard for exploring deals, tracking ROI, and managing investment interests.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
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
