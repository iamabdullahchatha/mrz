"use server";

import { Resend } from "resend";
import { CONTACT } from "@/lib/routes";

/* ---------------------------------------------------------------------------
 * Contact form delivery via Resend.
 *
 * Called imperatively from the client form in src/components/contact. Keeps the
 * API key on the server — it is read from RESEND_API_KEY and never reaches the
 * browser. Addresses are configurable so the "from" can move to a verified MRZ
 * domain later without a code change:
 *
 *   RESEND_API_KEY    (required)  the Resend secret, e.g. re_xxx
 *   CONTACT_FROM_EMAIL           sender; must be a Resend-verified domain.
 *                                Falls back to Resend's shared onboarding
 *                                sender so the form works before a domain is
 *                                verified.
 *   CONTACT_TO_EMAIL             recipient; defaults to the public inbox.
 * ------------------------------------------------------------------------- */

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
};

export type ContactResult = { ok: true } | { ok: false; error: string };

const FROM = process.env.CONTACT_FROM_EMAIL ?? "MRZ Website <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL ?? CONTACT.email;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function sendContactMessage(data: ContactPayload): Promise<ContactResult> {
  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const message = data.message?.trim() ?? "";
  const phone = data.phone?.trim() ?? "";
  const company = data.company?.trim() ?? "";
  const interest = data.service?.trim() || "General enquiry";

  // Server-side validation — the client checks too, but never trust it.
  if (!name || !email || !message) {
    return { ok: false, error: "Please add your name, email and a short message so we can reply." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "That email address doesn't look right — please check it and try again." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return { ok: false, error: "We couldn't send your message just now. Please email us directly and we'll help." };
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    phone ? ["Phone", phone] : null,
    company ? ["Company", company] : null,
    ["Interest", interest],
  ].filter((r): r is [string, string] => r !== null);

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessage:\n${message}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0b1020">
      <h2 style="margin:0 0 4px;font-size:18px">New website enquiry</h2>
      <p style="margin:0 0 20px;color:#64748b;font-size:13px">${esc(interest)}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${esc(
                k,
              )}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0">
        <div style="color:#64748b;font-size:13px;margin-bottom:6px">Message</div>
        <div style="white-space:pre-wrap;line-height:1.6">${esc(message)}</div>
      </div>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `Website enquiry — ${interest}`,
      text,
      html,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return { ok: false, error: "We couldn't send your message just now. Please email us directly and we'll help." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[contact] send failed:", err);
    return { ok: false, error: "We couldn't send your message just now. Please email us directly and we'll help." };
  }
}
