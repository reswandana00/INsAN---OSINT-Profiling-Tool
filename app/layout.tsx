import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { WebSocketProvider } from "./api/WebSocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INsAN",
  description: "Osint tools for profiling",
  icons: [{ rel: "icon", url: "favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <div className="fixed top-0 -z-10 h-screen w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_25%,#63e_180%)]" />
        <main className="relative z-10">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <WebSocketProvider>{children}</WebSocketProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                success: {
                  style: {
                    background: "#020617 ",
                    color: "#ffffff",
                    border: "1px solid #FF0000",
                    fontWeight: "600",
                  },
                },
                error: {
                  style: {
                    background: "#020617 ",
                    color: "#ffffff",
                    border: "1px solid #FF0000",
                    fontWeight: "600",
                  },
                },
                duration: 1000,
              }}
            />
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
