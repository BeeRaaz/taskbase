import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskBase",
  description: "TaskBase is an app to manage your tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased w-full min-w-80`}>
        <QueryProvider>
          <AuthProvider>
            <div className="w-full relative overflow-clip">
              <Header />
              <div>
                <main>{children}</main>
              </div>
            </div>
          </AuthProvider>
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
