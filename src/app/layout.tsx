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
    default: seoConfig.defaultMetadata.home.title.en,
    template: `%s | ${seoConfig.company.name}`
  },
  description: seoConfig.defaultMetadata.home.description.en,
  keywords: seoConfig.company.keywords.en.join(', '),
  authors: [{ name: seoConfig.company.name }],
  creator: seoConfig.company.name,
  publisher: seoConfig.company.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: seoConfig.siteUrl,
    siteName: seoConfig.company.name,
    title: seoConfig.defaultMetadata.home.title.en,
    description: seoConfig.defaultMetadata.home.description.en,
    images: [
      {
        url: `${seoConfig.siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${seoConfig.company.name} - Auto Parts & Car Accessories`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: seoConfig.twitter.site,
    creator: seoConfig.twitter.creator,
  },
  alternates: {
    canonical: seoConfig.siteUrl,
    languages: {
      'en': seoConfig.siteUrl,
      'ar': `${seoConfig.siteUrl}/ar`,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: 'automotive',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
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
