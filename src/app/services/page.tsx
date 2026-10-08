import type { Metadata } from "next";
import { ServicesIndex } from "@/components/services/ServicesIndex";

export const metadata: Metadata = {
  title: "Services | MRZ Management Services — Ten Specialist Services, One UAE Team",
  description:
    "Explore the ten specialist services from MRZ Management Services FZE LLC — commercial brokerage, general trading, IT consultancy, cyber security architecture, management services, petroleum & gas engineering consultancy, HR consultancy, HR provision, manpower & workforce solutions and HR compliance & risk management — delivered by one coordinated team.",
};

export default function ServicesPage() {
  return <ServicesIndex />;
}
