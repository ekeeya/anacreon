import type { Metadata } from "next";
import { Nunito_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { ReduxProvider } from "@/store";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anacreon Admin Dashboard",
  description: "Modern admin dashboard for business management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${jetBrainsMono.variable} antialiased font-sans bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-gray-50 min-h-screen`}
      >
        <ReduxProvider>
          <ThemeProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              {/* Main content area */}
              <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur z-10">
                  <div className="font-semibold text-lg tracking-tight">Admin Dashboard</div>
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button className="relative rounded-full bg-blue-100 dark:bg-blue-900 p-2 hover:scale-105 transition-transform">
                      <span className="sr-only">Notifications</span>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-600 dark:text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">A</div>
                  </div>
                </header>
                {/* Main content */}
                <main className="flex-1 p-8 bg-gray-50 dark:bg-neutral-950 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
