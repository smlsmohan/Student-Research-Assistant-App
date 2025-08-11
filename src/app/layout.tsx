import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CORDIS Research Explorer",
  description: "Explore European research and innovation projects from HORIZON, H2020, and FP7 programmes. Discover cutting-edge research, funding opportunities, and collaboration networks.",
  keywords: "CORDIS, European research, HORIZON, H2020, FP7, research projects, innovation, funding",
  authors: [{ name: "Research Explorer Team" }],
  openGraph: {
    title: "CORDIS Research Explorer",
    description: "Explore 79,069+ European research projects",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
