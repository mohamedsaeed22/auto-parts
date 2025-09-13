import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import { seoConfig } from "@/lib/seo/config";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: seoConfig.defaultMetadata.home.title.ar,
    template: `%s | ${seoConfig.company.name}`,
  },
  description: seoConfig.defaultMetadata.home.description.ar,
  keywords: seoConfig.company.keywords.ar.join(", "),
  authors: [{ name: seoConfig.company.name }],
  creator: seoConfig.company.name,
  publisher: seoConfig.company.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: seoConfig.siteUrl,
    siteName: seoConfig.company.name,
    title: seoConfig.defaultMetadata.home.title.ar,
    description: seoConfig.defaultMetadata.home.description.ar,
    images: [
      {
        url: `${seoConfig.siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${seoConfig.company.name} - قطع غيار السيارات والإكسسوارات`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: seoConfig.twitter.site,
    creator: seoConfig.twitter.creator,
  },
  alternates: {
    canonical: seoConfig.siteUrl,
    languages: {
      ar: seoConfig.siteUrl,
      en: `${seoConfig.siteUrl}/en`,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: "automotive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
