import { Metadata } from "next";
import { fetchBrandById } from "@/lib/api/server";
import { generateBrandPageMetadata } from "@/lib/seo/dynamic-metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    // Fetch brand data for metadata
    const brand = await fetchBrandById(id, locale);

    if (!brand) {
      // Return default metadata for non-existent brands
      return {
        title: "Brand Not Found",
        description: "The requested brand could not be found.",
      };
    }

    return generateBrandPageMetadata(brand, locale);
  } catch (error) {
    console.error("Error generating brand metadata:", error);
    // Return fallback metadata in case of errors
    return {
      title: "Error Loading Brand",
      description: "There was an error loading the brand information.",
    };
  }
}

export default function BrandLayout({ children }: Props) {
  return <>{children}</>;
}
