import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Fashion Hub – Premium Fashion Marketplace",
  description:
    "Discover curated fashion designed for the way you move, live and express yourself. Shop premium men's, women's and kids' collections.",
  keywords: ["fashion", "luxury", "premium", "clothing", "designer", "menswear", "womenswear"],
  openGraph: {
    title: "Fashion Hub – Premium Fashion Marketplace",
    description:
      "Discover curated fashion designed for the way you move, live and express yourself.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
