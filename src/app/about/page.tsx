import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About MRZ | One UAE Team Behind Every Part of Your Business",
  description:
    "MRZ Management Services FZE LLC coordinates commercial brokerage, trading, IT & cyber security, engineering, accounting, HR and documents clearing from Ajman Free Zone — one accountable team serving businesses across the UAE.",
};

export default function AboutPage() {
  return <AboutContent />;
}
