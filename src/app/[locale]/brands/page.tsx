import React from "react";
import { generateBrandPageMetadata } from "@/lib/seo/metadata-generator";
import BrandsPageClient from "./BrandsPageClient";

// Server Component - handles metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generateBrandPageMetadata({ id: 0, name: "Brands" }, locale);
}

// Server Component - renders the client component
export default async function BrandsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return <BrandsPageClient locale={locale} />;
}
