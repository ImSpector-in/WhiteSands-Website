import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "White Sands Construction | Hawaii General Contractor",
  description:
    "White Sands Construction Inc. — Hawaii's trusted general contractor since 1988. Custom homes, commercial construction, and hotel & resort remodeling on the Big Island.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col font-body antialiased">
        <Nav />
        <main className="flex-1 pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
