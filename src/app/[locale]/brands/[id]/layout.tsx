import { Metadata } from "next";
import { generateBrandPageMetadata } from "@/lib/seo/dynamic-metadata";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://falparts.cloud/api";

// Server-side function to fetch all brands
async function fetchBrands(locale?: string) {
  try {
    const url = new URL(`${API_BASE_URL}/brands`);
    if (locale) url.searchParams.set("locale", locale);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.items || [];
  } catch (error) {
    return [];
  }
}

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    // Fetch all brands
    const brands = await fetchBrands(locale);

    // Find the specific brand
    const brand = brands.find((b: any) => b.id === parseInt(id));

    if (!brand) {
      return {
        title:
          locale === "ar" ? "العلامة التجارية غير موجودة" : "Brand Not Found",
        description:
          locale === "ar"
            ? "لم يتم العثور على العلامة التجارية المطلوبة"
            : "The requested brand could not be found.",
      };
    }

    return generateBrandPageMetadata(brand, locale);
  } catch (error) {
    return {
      title:
        locale === "ar"
          ? "خطأ في تحميل العلامة التجارية"
          : "Error Loading Brand",
      description:
        locale === "ar"
          ? "حدث خطأ أثناء تحميل معلومات العلامة التجارية"
          : "There was an error loading the brand information.",
    };
  }
}

export default function BrandLayout({ children }: Props) {
  return <>{children}</>;
}
