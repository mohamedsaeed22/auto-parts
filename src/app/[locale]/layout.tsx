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

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "فال الغربية",
  description: "فال الغربية",
};

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
    "userProfile",
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
          <NuqsAdapter>
            <LocaleProvider initialLocale={locale}>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Cart />
              <WhatsAppButton />
            </LocaleProvider>
          </NuqsAdapter>
        </Providers>
      </I18NProvider>
    </div>
  );
}
