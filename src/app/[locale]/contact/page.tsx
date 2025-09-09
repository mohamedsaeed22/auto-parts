import React from "react";
import { ContactPageClient } from "./ContactPageClient";
import { SEOMetadata } from "@/components/seo/SEOMetadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { seoConfig, getKeywords } from "@/lib/seo/config";






export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <SEOMetadata
        title={seoConfig.defaultMetadata.contact.title[locale as keyof typeof seoConfig.defaultMetadata.contact.title] || seoConfig.defaultMetadata.contact.title.en}
        description={seoConfig.defaultMetadata.contact.description[locale as keyof typeof seoConfig.defaultMetadata.contact.description] || seoConfig.defaultMetadata.contact.description.en}
        keywords={getKeywords(locale)}
        locale={locale}
        type="website"
      />
      <StructuredData
        type="organization"
        data={{
          name: seoConfig.company.name,
          description: seoConfig.company.description[locale as keyof typeof seoConfig.company.description] || seoConfig.company.description.en,
          url: `${seoConfig.siteUrl}/${locale}/contact`,
          address: seoConfig.company.address,
          phone: seoConfig.company.phone,
          email: seoConfig.company.email,
        }}
        locale={locale}
      />
      <ContactPageClient locale={locale} />
    </>
  );
}
