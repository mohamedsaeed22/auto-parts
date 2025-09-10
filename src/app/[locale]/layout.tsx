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
import { seoConfig, getLocalizedMetadata, getKeywords } from "@/lib/seo/config";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const localizedMeta = getLocalizedMetadata("home", locale);
  const keywords = getKeywords(locale);

  return {
    title: {
      default: localizedMeta.title,
      template: `%s | ${seoConfig.company.name}`,
    },
    description: localizedMeta.description,
    keywords: keywords,
    openGraph: {
      title: localizedMeta.title,
      description: localizedMeta.description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SA",
    },
    alternates: {
      canonical:
        locale === "en" ? seoConfig.siteUrl : `${seoConfig.siteUrl}/${locale}`,
      languages: {
        en: seoConfig.siteUrl,
        ar: `${seoConfig.siteUrl}/ar`,
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
            <NuqsAdapter>
              <LocaleProvider initialLocale={locale}>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Cart />
                <WhatsAppButton />
              </LocaleProvider>
            </NuqsAdapter>
          </AuthProvider>
        </Providers>
      </I18NProvider>
    </div>
  );
}
