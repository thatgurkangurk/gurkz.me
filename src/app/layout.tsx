import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import Providers from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { getQueryClient } from "@/lib/get-query-client";
import { orpc } from "@/lib/orpc";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "gurkan's website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(orpc.session.get.queryOptions());
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Header
                sheetPosition="left"
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
            </HydrationBoundary>

            <main className="p-2">{children}</main>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
