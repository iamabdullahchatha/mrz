import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries } from "@/data/industries";
import { industryDetails } from "@/data/industryContent";
import { IndustryDetail } from "@/components/industries/IndustryDetail";

/** Pre-render a page for each industry at build time. */
export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.id }));
}

function findIndustry(slug: string) {
  return industries.find((i) => i.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = findIndustry(slug);
  if (!industry) return {};
  return {
    title: `${industry.title} | MRZ Management Services`,
    description: industry.description,
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = findIndustry(slug);
  const detail = industry ? industryDetails[industry.id] : undefined;
  if (!industry || !detail) notFound();

  return <IndustryDetail industry={industry} detail={detail} />;
}
