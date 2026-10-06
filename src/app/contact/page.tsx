import type { Metadata } from "next";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact MRZ | Amber Gem Tower, Ajman",
  description:
    "Visit MRZ Management Services FZE LLC at Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, United Arab Emirates. Call 06 808 8888 or email info@mrzuae.com.",
};

export default function ContactPage() {
  return <ContactContent />;
}
