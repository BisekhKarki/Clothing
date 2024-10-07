import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CANONICAL_URL, MEASUREMENT_ID } from "@/constant/constant";
import ReactQueryProvider from "@/services/QueryProvider";
import StockMarquee from "@/components/common/StockMarquee";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: {
    template: "%s | Dharke",
    default: "Dharke",
  },
 
  description:
    "Track #NEPSE stock prices live with Dharke. Manage multiple portfolios, set personalized alerts, and get notified instantly via Discord, Telegram, or email.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "NEPSE",
    "Nepal Stock Exchange",
    "Stock Prices",
    "Stock Alerts",
    "Stock Market",
    "Dharke",
  ],
  authors: [{ name: "Vuldesk Technologies Private Limited" }],
  alternates: {
    canonical: "./",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${poppins.className} text-[#ffffff] bg-[#0E0E0E] scroll-smooth`}
      >
        <ReactQueryProvider>
          <div className="z-[99999] sticky top-0 bg-black">

          <StockMarquee />
          </div>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
          <GoogleAnalytics gaId={MEASUREMENT_ID} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
