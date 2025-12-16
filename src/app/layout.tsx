import { Layout } from "@/components/Layout";
import type { Metadata } from "next";
import { Cinzel, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "Bahion",
    template: "%s | Bahion",
  },
  description:
    "Description courte et optimisée SEO de ton application ou site web.",

  applicationName: "Bahion",
  authors: [{ name: "Yanis Dessaint", url: "https://bahion.com" }],
  creator: "Dessaint Yanis",
  publisher: "Bahion",

  metadataBase: new URL("https://bahion.com"),

  keywords: [
    "nextjs",
    "react",
    "web app",
    "saas",
    "typescript",
    "aion",
    "aion 2",
    "aion 2 builder",
    "aion 2 build",
    "aion 2 build builder",
    "aion 2 build builder online",
    "aion 2 build builder free",
    "aion 2 build builder tool",
    "aion 2 build builder tool online",
    "aion 2 build builder tool free",
    "aion 2 build builder tool tool",
    "aion 2 build builder tool tool online",
    "aion 2 build builder tool tool free",
    "aion 2 build builder tool tool tool",
    "aion 2 build builder tool tool tool online",
    
  ],

  openGraph: {
    title: "Bahion",
    description:
      "Bahion est un builder pour Aion 2, il permet de créer des builds pour les classes de Aion 2.",
    url: "https://bahion.com",
    siteName: "Bahion",
    images: [
      {
        url: "/LO_Bahion.webp",
        width: 1200,
        height: 630,
        alt: "Aperçu du site",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  icons: {
    icon: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "video-games",
  alternates: {
    canonical: "https://bahion.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${roboto.className} ${cinzel.variable} dark antialiased bg-[url('/BG_Bahion.webp')] bg-cover`}
      >
        <Analytics />
        <Providers>
          <Layout>
            {children}
            <Toaster />
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
