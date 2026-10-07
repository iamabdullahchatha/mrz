import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "mrz-lake.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteUrl}`),
  title: "MRZ Management Services FZE LLC | UAE Business, Trading, IT & Consultancy Services",
  description:
    "MRZ Management Services FZE LLC provides commercial brokerage, general trading, IT consultancy, cyber security architecture, HR consultancy and UAE documents clearing services.",
  openGraph: {
    type: "website",
    siteName: "MRZ Management Services",
    title: "MRZ Management Services FZE LLC | UAE Business, Trading, IT & Consultancy Services",
    description:
      "MRZ Management Services FZE LLC provides commercial brokerage, general trading, IT consultancy, cyber security architecture, HR consultancy and UAE documents clearing services.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "MRZ Management Services — UAE business, trading, technology and consultancy solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MRZ Management Services FZE LLC | UAE Business, Trading, IT & Consultancy Services",
    description:
      "MRZ Management Services FZE LLC provides commercial brokerage, general trading, IT consultancy, cyber security architecture, HR consultancy and UAE documents clearing services.",
    images: ["/brand/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
