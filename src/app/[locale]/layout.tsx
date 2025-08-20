import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Cart from "@/components/Cart";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Providers } from "@/store/providers";
import { Locale } from "@/lib/types";
import { getDirection } from "@/lib/utils/index";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import I18NProvider from "@/components/i18n/i18n-provider";
import { serverSideTranslation } from "@/lib/i18n";

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
  const ns = ["common", "header", "footer", "cart", "userPricing", "product"]; // Added product namespace
  const { resources } = await serverSideTranslation(locale, ns);
  const direction = getDirection(locale);

  return (
    <html lang={locale} dir={direction}>
      <body className={`${cairo.variable} antialiased`}>
        <I18NProvider locale={locale} namespaces={ns} resources={resources}>
          <Providers>
            <Header />
            {children}
            <Footer />
            <Cart />
            <WhatsAppButton />
          </Providers>
        </I18NProvider>
      </body>
    </html>
  );
}
