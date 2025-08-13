import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ChatbotButton } from "@/components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Research Assistant App",
  description: "AI-powered research assistant for students. Explore European research opportunities, find funding, connect with professors, and discover research areas with CORDIS data.",
  keywords: "student research assistant, research opportunities, CORDIS, European research, funding, professors, research areas, academic search",
  authors: [{ name: "Student Research Assistant Team" }],
  openGraph: {
    title: "Student Research Assistant App",
    description: "Find research opportunities, funding, and academic connections with AI-powered insights",
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
        <ThemeProvider>
          {children}
          <ChatbotButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
