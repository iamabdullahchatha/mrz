import type { Metadata } from "next";
import { IndustriesIndex } from "@/components/industries/IndustriesIndex";

export const metadata: Metadata = {
  title: "Industries | MRZ Management Services — Sector Support Across the UAE",
  description:
    "Specialist support for trading companies, construction & engineering, oil, gas & industrial, IT & technology, corporate & SMEs, and documentation & compliance across the UAE — delivered by one coordinated MRZ team.",
};

export default function IndustriesPage() {
  return <IndustriesIndex />;
}
