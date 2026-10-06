import type { Metadata } from "next";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact MRZ | Talk to One UAE Team in Ajman Free Zone",
  description:
    "Get in touch with MRZ Management Services FZE LLC. Call 06 808 8888, email info@mrzuae.com, or send a message — one accountable team for trade, technology, finance, HR, engineering and compliance across the UAE.",
};

export default function ContactPage() {
  return <ContactContent />;
}
