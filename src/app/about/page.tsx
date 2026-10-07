import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About MRZ | One UAE Team Behind Every Part of Your Business",
  description:
    "MRZ Management Services FZE LLC is based at Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, and coordinates commercial brokerage, trading, IT & cyber security, engineering, HR and documents clearing for businesses across the UAE.",
};

export default function AboutPage() {
  return <AboutContent />;
}
