import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConfidentKids - Raising Confident, Resilient Children",
  description: "A research-backed approach to building confidence in children of all ages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  );
}
