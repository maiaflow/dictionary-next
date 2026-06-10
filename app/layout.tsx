import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dictionary",
  description: "A browsable dictionary with alphabet filters and source excerpts.",
};

const themeBootScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem("dictionary-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = storedTheme || (prefersDark ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <SiteHeader />
        <main id="main-content" className="site-main">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
