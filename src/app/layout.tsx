import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthButtons } from "@/components/auth-buttons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Dungeon master",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Header Bar */}
          <header className="px-6 py-4 bg-white border-b text-neutral-800 border-neutral-300">
            <div className="container flex items-center justify-between mx-auto">
              <Link href="/" className="text-xl font-bold">
                AI Dungeon Master
              </Link>
              <nav className="space-x-4">
                <AuthButtons />
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="container flex-1 p-6 mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
