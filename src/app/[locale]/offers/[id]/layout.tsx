import { Metadata } from "next";
import { fetchOfferById } from "@/lib/api/server";
import { generateOfferPageMetadata } from "@/lib/seo/dynamic-metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  // Fetch offer data for metadata
  const offer = await fetchOfferById(id, locale);

  return generateOfferPageMetadata(offer, locale);
}

export default function OfferLayout({ children }: Props) {
  return <>{children}</>;
}
