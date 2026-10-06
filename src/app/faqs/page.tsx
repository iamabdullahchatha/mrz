import type { Metadata } from "next";
import { FaqsContent } from "@/components/faqs/FaqsContent";

export const metadata: Metadata = {
  title: "FAQs | MRZ Management Services — One UAE Team",
  description:
    "Answers to common questions about MRZ Management Services FZE LLC — the ten services we provide, how we work across the UAE from Ajman Free Zone, and how to get started with a free consultation.",
};

export default function FaqsPage() {
  return <FaqsContent />;
}
