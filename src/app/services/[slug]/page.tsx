import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, serviceSlug, services } from "@/data/services";
import { serviceDetails } from "@/data/serviceContent";
import { ServiceDetail } from "@/components/services/ServiceDetail";

/** Pre-render a page for each vetted service route at build time. */
export function generateStaticParams() {
  return services.map((s) => ({ slug: serviceSlug(s) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} | MRZ Management Services`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  const detail = service ? serviceDetails[service.id] : undefined;
  if (!service || !detail) notFound();

  return <ServiceDetail service={service} detail={detail} />;
}
