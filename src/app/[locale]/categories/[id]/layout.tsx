import { Metadata } from "next";
import { fetchCategoryById } from "@/lib/api/server";
import { generateCategoryPageMetadata } from "@/lib/seo/dynamic-metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  // Fetch category data for metadata
  const category = await fetchCategoryById(id, locale);

  return generateCategoryPageMetadata(category, locale);
}

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}
