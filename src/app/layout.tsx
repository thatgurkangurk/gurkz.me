import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import Providers from "@/components/providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "gurkan's website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased`}>
        <Providers>
          <Header
            links={[
              {
                label: "home",
                to: "/",
              },
              {
                label: "music id list",
                to: "/music",
              },
            ]}
          />
          <main className="p-2">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
