import type { Metadata } from "next";
import "./globals.css";
import "./neo-brutal.css";

export const metadata: Metadata = {
  title: "Null Own — RWA Privacy Labs",
  description: "Cryptographic stealth addresses & zero-knowledge proofs for Real World Assets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
