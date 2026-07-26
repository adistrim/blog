import type { Metadata } from "next";
import { Changa, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/header";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const changa = Changa({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aditya Raj | Blogs",
  description: "Notes on software, things I build, and things I find interesting.",
  icons: {
    icon: [{ url: "/me.webp", type: "image/webp" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", changa.className, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
