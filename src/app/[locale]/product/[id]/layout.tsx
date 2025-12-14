import { Metadata } from "next";
import { fetchProductById } from "@/lib/api/server";
import { generateProductPageMetadata } from "@/lib/seo/dynamic-metadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateProductStructuredData } from "@/lib/seo/config";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  // Fetch product data for metadata
  const product = await fetchProductById(id, locale);

  return generateProductPageMetadata(product, locale);
}

export default async function ProductLayout({ params, children }: Props) {
  const { locale, id } = await params;
  const product = await fetchProductById(id, locale);

  return (
    <>
      {product && (
        <StructuredData
          type="product"
          data={generateProductStructuredData(product)}
          locale={locale}
        />
      )}
      {children}
    </>
  );
}
