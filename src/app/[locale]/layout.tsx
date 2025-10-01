import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import Cart from "@/components/Cart";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Providers } from "@/store/providers";
import { Locale } from "@/lib/types";
import { getDirection } from "@/lib/utils/index";
import { cn } from "@/lib/utils";
import LocaleProvider from "@/components/providers/LocaleProvider";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import I18NProvider from "@/components/i18n/i18n-provider";
import { serverSideTranslation } from "@/lib/i18n";
import { NuqsAdapter } from "nuqs/adapters/react";
import { AuthProvider } from "@/contexts/auth-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { seoConfig, getLocalizedMetadata, getKeywords } from "@/lib/seo/config";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const localizedMeta = getLocalizedMetadata("home", locale);
  const keywords = getKeywords(locale);
  const baseUrl = seoConfig.siteUrl;
  const pageUrl = locale === "ar" ? baseUrl : `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: localizedMeta.title,
      template: `%s | ${seoConfig.company.name}`,
    },
    description: localizedMeta.description,
    keywords: keywords,
    openGraph: {
      type: "website",
      url: pageUrl,
      siteName: seoConfig.company.name,
      title: localizedMeta.title,
      description: localizedMeta.description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SA",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: seoConfig.company.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: localizedMeta.title,
      description: localizedMeta.description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical:
        locale === "ar" ? seoConfig.siteUrl : `${seoConfig.siteUrl}/${locale}`,
      languages: {
        ar: seoConfig.siteUrl,
        en: `${seoConfig.siteUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const ns = [
    "common",
    "header",
    "footer",
    "cart",
    "userPricing",
    "product",
    "productDetails",
    "userProfile",
    "categories",
    "categoryDetail",
    "auth",
    "registration",
    "profileFormErrors",
    "notifications",
    "returnExchangePolicy",
    "userAgreement",
  ];
  const { resources } = await serverSideTranslation(locale, ns);
  const direction = getDirection(locale);

  return (
    <div
      lang={locale}
      dir={direction}
      className={cn(
        "min-h-screen flex flex-col",
        cairo.variable,
        direction === "rtl" ? "text-right" : "text-left"
      )}
    >
      <I18NProvider locale={locale} namespaces={ns} resources={resources}>
        <Providers>
          <AuthProvider>
            <NotificationProvider>
              <NuqsAdapter>
                <LocaleProvider initialLocale={locale}>
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <Cart />
                  <WhatsAppButton />
                </LocaleProvider>
              </NuqsAdapter>
            </NotificationProvider>
          </AuthProvider>
        </Providers>
      </I18NProvider>
    </div>
  );
}
