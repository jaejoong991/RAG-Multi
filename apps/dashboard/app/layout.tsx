import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAG Multi-Tenant Platform",
  description: "Enterprise-grade AI Knowledge Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
