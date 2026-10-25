import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {title: "demosaas", description: "saas application",};

// AuthProviderはここに置く
export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
