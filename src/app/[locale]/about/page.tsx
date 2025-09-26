"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { SEOMetadata } from "@/components/seo/SEOMetadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { seoConfig } from "@/lib/seo/config";
import {
  ArrowLeft,
  Building2 as Building2Icon,
  Users as UsersIcon,
  Award as AwardIcon,
  Shield as ShieldIcon,
  Globe as GlobeIcon,
  Target as TargetIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Wrench as WrenchIcon,
  Truck as TruckIcon,
  Clock as ClockIcon,
  HeadphonesIcon,
  Globe,
  Mail,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Hero Section Component
const HeroSection = ({ t }: { t: (key: string) => string }) => (
  <div className="bg-gradient-to-br from-logo-gold via-amber-500 to-amber-600 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <Badge
          variant="secondary"
          className="mb-6 bg-white/20 text-white border-white/30"
        >
          {t("hero.badge")}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {t("hero.title")}
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-8">
          {t("hero.subtitle")}
        </p>
        <div className="flex items-center justify-center gap-8 text-white/80 flex-wrap">
          <div className="flex items-center gap-2">
            <Building2Icon className="h-5 w-5" />
            <span>{t("hero.location")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>{t("hero.brands")}</span>
          </div>
          <div className="flex items-center gap-2">
            <AwardIcon className="h-5 w-5" />
            <span>{t("hero.quality")}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Company Profile Component
const CompanyProfile = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="py-16 bg-[var(--muted)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Company Info Section */}
        <div className={`space-y-6 ${isRTL ? "lg:order-1" : "lg:order-2"}`}>
          <div>
            <Badge variant="outline" className="mb-4">
              {t("profile.badge")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              {t("profile.title")}
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] mb-6">
              {t("profile.subtitle")}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircleIcon className="h-4 w-4 text-logo-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">
                  {t("profile.experience.title")}
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  {t("profile.experience.desc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircleIcon className="h-4 w-4 text-logo-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">
                  {t("profile.brands.title")}
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  {t("profile.brands.desc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircleIcon className="h-4 w-4 text-logo-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">
                  {t("profile.supplier.title")}
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  {t("profile.supplier.desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className={`${isRTL ? "lg:order-1" : "lg:order-2"}`}>
          <div className="bg-gradient-to-br from-logo-gold to-amber-600 rounded-2xl p-8 text-white">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Building2Icon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">
                {t("profile.contact.title")}
              </h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-white/80" />
                  <div className="text-white">
                    {t("profile.contact.locationValue")}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-white/80" />
                  <div className="text-white">
                    {t("profile.contact.mobileValue")}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-white/80" />
                  <a
                    href={`mailto:${t("profile.contact.emailValue")}`}
                    className="flex items-center gap-2 text-white hover:text-white/80 transition-colors cursor-pointer"
                  >
                    <span>{t("profile.contact.emailValue")}</span>
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-white/80" />
                  <a
                    href={`https://${t("profile.contact.websiteValue")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white hover:text-white/80 transition-colors cursor-pointer"
                  >
                     <span>{t("profile.contact.websiteValue")}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Mission & Vision Component
const MissionVision = ({ t }: { t: (key: string) => string }) => (
  <div className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          {t("mission.title")}
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
          {t("mission.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-2 border-logo-gold/30 hover:border-logo-gold transition-colors">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-logo-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <TargetIcon className="h-8 w-8 text-logo-gold" />
            </div>
            <CardTitle className="text-2xl font-bold text-[var(--foreground)]">
              {t("mission.vision.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[var(--muted-foreground)] mb-6 text-lg leading-relaxed">
              {t("mission.vision.desc")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-logo-gold/30 hover:border-logo-gold transition-colors">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-logo-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <LightbulbIcon className="h-8 w-8 text-logo-gold" />
            </div>
            <CardTitle className="text-2xl font-bold text-[var(--foreground)]">
              {t("mission.mission.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[var(--muted-foreground)] mb-6 text-lg leading-relaxed">
              {t("mission.mission.desc")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// Services Component
const ServicesSection = ({ t }: { t: (key: string) => string }) => (
  <div className="py-16 bg-[var(--muted)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          {t("services.title")}
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
          {t("services.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: ShieldIcon,
            title: t("services.genuine.title"),
            desc: t("services.genuine.desc"),
          },
          {
            icon: GlobeIcon,
            title: t("services.global.title"),
            desc: t("services.global.desc"),
          },
          {
            icon: ClockIcon,
            title: t("services.pricing.title"),
            desc: t("services.pricing.desc"),
          },
          {
            icon: TruckIcon,
            title: t("services.delivery.title"),
            desc: t("services.delivery.desc"),
          },
          {
            icon: HeadphonesIcon,
            title: t("services.support.title"),
            desc: t("services.support.desc"),
          },
          {
            icon: UsersIcon,
            title: t("services.customer.title"),
            desc: t("services.customer.desc"),
          },
        ].map((service, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow bg-[var(--card)] border-[var(--border)]"
          >
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-logo-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <service.icon className="h-8 w-8 text-logo-gold" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                {service.title}
              </h3>
              <p className="text-[var(--muted-foreground)]">{service.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Product Categories Component
const ProductCategories = ({ t }: { t: (key: string) => string }) => (
  <div className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          {t("categories.title")}
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
          {t("categories.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            icon: WrenchIcon,
            title: t("categories.engine"),
          },
          {
            icon: Building2Icon,
            title: t("categories.transmission"),
          },
          {
            icon: ShieldIcon,
            title: t("categories.suspension"),
          },
          {
            icon: LightbulbIcon,
            title: t("categories.electrical"),
          },
        ].map((category, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow bg-gradient-to-b from-[var(--card)] to-[var(--muted)] border-[var(--border)]"
          >
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-logo-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <category.icon className="h-8 w-8 text-logo-gold" />
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                {category.title}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Supported Brands Component
const SupportedBrands = ({ t }: { t: (key: string) => string }) => (
  <div className="py-16 bg-[var(--muted)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          {t("brands.title")}
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
          {t("brands.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {[
          "GEELY",
          "CHANGAN",
          "BAIC",
          "CHERY",
          "FAW",
          "HYUNDAI",
          "KIA MOTORS",
          "JETOUR",
          "HAVAL",
        ].map((brand, index) => (
          <div
            key={index}
            className="bg-[var(--card)] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center border-[var(--border)]"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-logo-gold/15 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2Icon className="h-8 w-8 text-logo-gold" />
              </div>
              <h3 className="font-bold text-[var(--foreground)] text-sm">
                {brand}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Team Section Component
const TeamSection = ({ t }: { t: (key: string) => string }) => (
  <div className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          {t("team.title")}
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
          {t("team.subtitle")}
        </p>
      </div>

      <div className="bg-gradient-to-r from-logo-gold to-amber-600 rounded-2xl p-12 text-white text-center">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <UsersIcon className="h-12 w-12" />
        </div>
        <h3 className="text-2xl font-bold mb-4">{t("team.service.title")}</h3>
        <p className="text-white/90 text-lg max-w-3xl mx-auto">
          {t("team.service.desc")}
        </p>
      </div>
    </div>
  </div>
);

// Contact CTA Component
const ContactCTA = ({ t }: { t: (key: string) => string }) => (
  <div className="bg-gradient-to-r from-logo-gold to-amber-600 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("cta.title")}</h2>
      <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
        {t("cta.subtitle")}
      </p>
      {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-logo-gold hover:bg-gray-100"
        >
          {t("cta.contact")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white text-white   text-logo-gold"
        >
          {t("cta.learnMore")}
        </Button>
      </div> */}
      <div className="mt-8 text-white/80">
        <p className="mb-2">{t("cta.contactInfo")}</p>
        <p>{t("cta.location")}</p>
      </div>
    </div>
  </div>
);

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const { t, i18n } = useTranslation("about");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const { locale } = React.use(params);

  // Scroll to top when component mounts
  useScrollToTop();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div dir={direction}>
      <SEOMetadata
        title={seoConfig.defaultMetadata.about.title[locale as "en" | "ar"]}
        description={
          seoConfig.defaultMetadata.about.description[locale as "en" | "ar"]
        }
        keywords={`فال الغربية, Fal Al-Gharbia, قطع غيار السيارات, automotive spare parts, جدة, Jeddah, Saudi Arabia`}
        locale={locale}
        type="website"
      />

      <StructuredData
        type="organization"
        data={{
          name: "Fal Al-Gharbia",
          description: isRTL
            ? "شركة سعودية رائدة في مجال بيع قطع غيار السيارات"
            : "Leading Saudi company specializing in automotive spare parts",
          url: `${seoConfig.siteUrl}/${locale}/about`,
        }}
        locale={locale}
      />

      <HeroSection t={t} />

      <CompanyProfile isRTL={isRTL} t={t} />
      <MissionVision t={t} />
      <ServicesSection t={t} />
      <ProductCategories t={t} />
      <SupportedBrands t={t} />
      <TeamSection t={t} />
      <ContactCTA t={t} />
    </div>
  );
}
