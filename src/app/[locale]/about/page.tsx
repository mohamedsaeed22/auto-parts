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
  Heart as HeartIcon,
  Target as TargetIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";

// Hero Section Component
const HeroSection = ({ t }: { t: (key: string) => string }) => (
  <div className="bg-gradient-to-br from-logo-gold via-amber-500 to-amber-600 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <Badge
          variant="secondary"
          className="mb-6 bg-white/20 text-white border-white/30"
        >
          {t("hero.badge") || "Established 2009"}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {t("hero.title") || "About Fal Parts"}
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-8">
          {t("hero.subtitle") ||
            "Leading the automotive parts industry with innovation, quality, and customer satisfaction for over 15 years"}
        </p>
        <div className="flex items-center justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            <span>{t("hero.customers") || "50K+ Customers"}</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon className="h-5 w-5" />
            <span>{t("hero.countries") || "25+ Countries"}</span>
          </div>
          <div className="flex items-center gap-2">
            <AwardIcon className="h-5 w-5" />
            <span>{t("hero.awards") || "15+ Awards"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Company Story Component
const CompanyStory = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className={`space-y-6 ${isRTL ? "lg:order-2" : ""}`}>
          <div>
            <Badge variant="outline" className="mb-4">
              {t("story.badge") || "Our Story"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("story.title") || "From Humble Beginnings to Industry Leader"}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t("story.subtitle") ||
                "Founded in 2009, Fal Parts started as a small family business with a big vision: to revolutionize the automotive parts industry in the Middle East."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircleIcon className="h-4 w-4 text-logo-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t("story.milestone1.title") || "2009 - Foundation"}
                </h3>
                <p className="text-gray-600">
                  {t("story.milestone1.desc") ||
                    "Started as a small shop in Riyadh with a vision to provide quality automotive parts."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircleIcon className="h-4 w-4 text-logo-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t("story.milestone2.title") || "2015 - Expansion"}
                </h3>
                <p className="text-gray-600">
                  {t("story.milestone2.desc") ||
                    "Expanded to 10 locations across Saudi Arabia and launched our e-commerce platform."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircleIcon className="h-4 w-4 text-logo-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t("story.milestone3.title") || "2020 - Innovation"}
                </h3>
                <p className="text-gray-600">
                  {t("story.milestone3.desc") ||
                    "Launched AI-powered parts matching and 24/7 customer support system."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircleIcon className="h-4 w-4 text-logo-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t("story.milestone4.title") || "2024 - Global Reach"}
                </h3>
                <p className="text-gray-600">
                  {t("story.milestone4.desc") ||
                    "Serving customers in 25+ countries with cutting-edge technology and unmatched service."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${isRTL ? "lg:order-1" : ""}`}>
          <div className="bg-gradient-to-br from-logo-gold to-amber-600 rounded-2xl p-8 text-white">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Building2Icon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">
                {t("story.stats.title") || "Our Numbers"}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">15+</div>
                  <div className="text-white/80 text-sm">
                    {t("story.stats.years") || "Years"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">50K+</div>
                  <div className="text-white/80 text-sm">
                    {t("story.stats.customers") || "Customers"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">100K+</div>
                  <div className="text-white/80 text-sm">
                    {t("story.stats.parts") || "Parts"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">25+</div>
                  <div className="text-white/80 text-sm">
                    {t("story.stats.countries") || "Countries"}
                  </div>
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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t("mission.title") || "Our Mission & Vision"}
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t("mission.subtitle") ||
            "Driving innovation and excellence in the automotive parts industry"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-2 border-logo-gold/30 hover:border-logo-gold/50 transition-colors">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-logo-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <TargetIcon className="h-8 w-8 text-logo-gold" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t("mission.mission.title") || "Our Mission"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              {t("mission.mission.desc") ||
                "To provide the highest quality automotive parts and exceptional service to our customers, ensuring their vehicles perform at their best while maintaining the highest standards of safety and reliability."}
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {t("mission.mission.point1") ||
                    "Quality assurance in every part"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {t("mission.mission.point2") ||
                    "Exceptional customer service"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {t("mission.mission.point3") ||
                    "Innovation in automotive solutions"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-logo-gold/30 hover:border-logo-gold/50 transition-colors">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-logo-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <LightbulbIcon className="h-8 w-8 text-logo-gold" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t("mission.vision.title") || "Our Vision"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              {t("mission.vision.desc") ||
                "To become the leading automotive parts provider in the Middle East and beyond, recognized for innovation, quality, and customer satisfaction, while contributing to the advancement of the automotive industry."}
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {t("mission.vision.point1") || "Global market leadership"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {t("mission.vision.point2") || "Technological innovation"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {t("mission.vision.point3") || "Industry advancement"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// Values Component
const CompanyValues = ({ t }: { t: (key: string) => string }) => (
  <div className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t("values.title") || "Our Core Values"}
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t("values.subtitle") || "The principles that guide everything we do"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: ShieldIcon,
            title: t("values.quality.title") || "Quality",
            desc:
              t("values.quality.desc") ||
              "We never compromise on quality. Every part we sell meets the highest industry standards.",
            color: "bg-logo-gold/15 text-logo-gold",
          },
          {
            icon: HeartIcon,
            title: t("values.customer.title") || "Customer First",
            desc:
              t("values.customer.desc") ||
              "Our customers are at the heart of everything we do. Their satisfaction is our priority.",
            color: "bg-logo-gold/15 text-logo-gold",
          },
          {
            icon: LightbulbIcon,
            title: t("values.innovation.title") || "Innovation",
            desc:
              t("values.innovation.desc") ||
              "We continuously innovate to provide cutting-edge solutions and better service.",
            color: "bg-logo-gold/15 text-logo-gold",
          },
          {
            icon: UsersIcon,
            title: t("values.integrity.title") || "Integrity",
            desc:
              t("values.integrity.desc") ||
              "We conduct business with honesty, transparency, and ethical practices.",
            color: "bg-logo-gold/15 text-logo-gold",
          },
        ].map((value, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div
                className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <value.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Team Component
const TeamSection = ({ t }: { t: (key: string) => string }) => (
  <div className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t("team.title") || "Our Leadership Team"}
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t("team.subtitle") || "Meet the experts driving our success"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: t("team.ceo.name") || "Ahmed Al-Rashid",
            position: t("team.ceo.position") || "Chief Executive Officer",
            desc:
              t("team.ceo.desc") ||
              "20+ years of automotive industry experience. Led Fal Parts from startup to market leader.",
            experience: t("team.ceo.experience") || "20+ Years",
          },
          {
            name: t("team.cto.name") || "Sarah Johnson",
            position: t("team.cto.position") || "Chief Technology Officer",
            desc:
              t("team.cto.desc") ||
              "Technology expert driving digital transformation and innovation across all platforms.",
            experience: t("team.cto.experience") || "15+ Years",
          },
          {
            name: t("team.coo.name") || "Mohammed Hassan",
            position: t("team.coo.position") || "Chief Operations Officer",
            desc:
              t("team.coo.desc") ||
              "Operations specialist ensuring seamless delivery and exceptional customer service.",
            experience: t("team.coo.experience") || "18+ Years",
          },
        ].map((member, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="w-24 h-24 bg-gradient-to-br from-logo-gold to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-logo-gold font-medium mb-3">
                {member.position}
              </p>
              <p className="text-gray-600 mb-4">{member.desc}</p>
              <Badge variant="outline" className="text-sm">
                {member.experience}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Contact CTA Component
const ContactCTA = ({ t }: { t: (key: string) => string }) => (
  <div className="bg-gradient-to-r from-logo-gold to-amber-600 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {t("cta.title") || "Ready to Experience Fal Parts?"}
      </h2>
      <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
        {t("cta.subtitle") ||
          "Join thousands of satisfied customers who trust us for their automotive needs"}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-logo-black hover:bg-gray-100"
        >
          {t("cta.contact") || "Contact Us"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white text-black hover:bg-white hover:text-logo-black"
        >
          {t("cta.learnMore") || "Learn More"}
        </Button>
      </div>
    </div>
  </div>
);

export default function AboutPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { t, i18n } = useTranslation("about");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const { locale } = params;

  // Scroll to top when component mounts
  useScrollToTop();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div dir={direction}>
      <SEOMetadata
        title={seoConfig.defaultMetadata.about.title[locale as "en" | "ar"]}
        description={
          seoConfig.defaultMetadata.about.description[locale as "en" | "ar"]
        }
        keywords={`${seoConfig.company.keywords[locale as "en" | "ar"]
          .slice(0, 10)
          .join(", ")}, about us, company history, automotive expertise`}
        locale={locale}
        type="website"
      />

      <StructuredData
        type="organization"
        data={{
          name: seoConfig.company.name,
          description: seoConfig.company.description[locale as "en" | "ar"],
          url: `${seoConfig.siteUrl}/${locale}/about`,
        }}
        locale={locale}
      />
      <HeroSection t={t} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav
          className={`flex items-center gap-2 text-sm text-gray-500 mb-8 ${
            isRTL ? "flex-row" : ""
          }`}
        >
          <button
            onClick={handleGoBack}
            className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
              isRTL ? "flex-row" : ""
            }`}
          >
            <>
              <ArrowLeft
                size={16}
                className={isRTL ? "transform rotate-180" : ""}
              />
              <span>{t("backButton") || "Back"}</span>
            </>
          </button>
          <span>/</span>
          <span className="text-gray-900">{t("about") || "About"}</span>
        </nav>
      </div>

      <CompanyStory isRTL={isRTL} t={t} />
      <MissionVision t={t} />
      <CompanyValues t={t} />
      <TeamSection t={t} />
      <ContactCTA t={t} />
    </div>
  );
}
