import React from "react";
import { seoConfig } from "@/lib/seo/config";
import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: seoConfig.defaultMetadata.home.title[locale as "en" | "ar"],
    description:
      seoConfig.defaultMetadata.home.description[locale as "en" | "ar"],
    keywords: seoConfig.company.keywords[locale as "en" | "ar"].join(", "),
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
    openGraph: {
      type: "website",
      title: seoConfig.defaultMetadata.home.title[locale as "en" | "ar"],
      description:
        seoConfig.defaultMetadata.home.description[locale as "en" | "ar"],
      url: seoConfig.siteUrl,
      siteName: seoConfig.company.name,
      images: [
        {
          url: `${seoConfig.siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: seoConfig.defaultMetadata.home.title[locale as "en" | "ar"],
        },
      ],
      locale: locale === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: seoConfig.defaultMetadata.home.title[locale as "en" | "ar"],
      description:
        seoConfig.defaultMetadata.home.description[locale as "en" | "ar"],
      images: [`${seoConfig.siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: seoConfig.siteUrl,
      languages: {
        ar: seoConfig.siteUrl,
        en: `${seoConfig.siteUrl}/en`,
      },
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt":
        seoConfig.defaultMetadata.home.title[locale as "en" | "ar"],
    },
  };
}

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <HomePageClient params={params} />;
}
