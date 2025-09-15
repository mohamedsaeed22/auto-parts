import { Metadata } from "next";
import { fetchBrandById } from "@/lib/api/server";
import { generateBrandPageMetadata } from "@/lib/seo/dynamic-metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  
  // Fetch brand data for metadata
  const brand = await fetchBrandById(id);
  
  return generateBrandPageMetadata(brand, locale);
}

export default function BrandLayout({ children }: Props) {
  return <>{children}</>;
}
