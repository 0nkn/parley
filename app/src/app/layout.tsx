import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Parley | AI-Powered Communication Assistant",
  description: "Helping individuals with speech disabilities and language barriers communicate effectively in healthcare settings and daily life.",
  keywords: "accessibility, speech assistant, healthcare communication, language barriers, assistive technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full`}>
        <div className="flex flex-col min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
