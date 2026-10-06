import type { Metadata } from "next";
import { FaqsContent } from "@/components/faqs/FaqsContent";

export const metadata: Metadata = {
  title: "FAQs | MRZ Management Services — One UAE Team",
  description:
    "Answers to common questions about MRZ Management Services FZE LLC, including our office at Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, the services we provide and how to get started.",
};

export default function FaqsPage() {
  return <FaqsContent />;
}
