import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AccountButtons } from "@/components/account-buttons";
import { Badge } from "@/components/ui/badge";
import { AccountSidebar } from "@/components/account-sidebar";
import { getUser } from "@/utils/supabase/server";
import { getUserInfo } from "@/db/services/userInfos";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Dungeon World",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let username;
  const { user } = await getUser();
  if (user) {
    let [userInfo] = await getUserInfo(user.id);
    username = userInfo.username;
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpeedInsights />
        <Analytics />
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Header Bar */}
          <header className="sticky top-0 left-0 right-0 z-50 px-6 py-4 border-b border-neutral-300 bg-[var(--header-background)] shadow-md shadow-[var(--header-shadow)] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-[var(--accent)]">
            <div className="container flex items-center justify-between mx-auto">
              <div className="flex items-center space-x-2 align-middle">
                <Link href="/" className="text-xl font-bold">
                  AI Dungeon World
                </Link>
                <Badge className="inline-flex items-center align-middle bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800 border border-yellow-300">
                  PREVIEW
                </Badge>
              </div>
              <nav className="space-x-4">
                <div className="block md:hidden">
                  <AccountSidebar username={username || "Adventurer"} />
                </div>

                <div className="hidden md:block">
                  <AccountButtons />
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto container p-6 mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
