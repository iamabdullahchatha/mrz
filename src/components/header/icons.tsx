import type { SVGProps } from "react";

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" {...props}>
      <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" {...props}>
      <path d="M5 11l6-6M6 5h5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true" {...props}>
      <path d="M3 4.75l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Plus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" {...props}>
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function Phone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5.6 2.5H3.9a1.4 1.4 0 0 0-1.4 1.5 10 10 0 0 0 9.5 9.5 1.4 1.4 0 0 0 1.5-1.4v-1.7l-2.6-1.1-1.3 1.3a7 7 0 0 1-3.1-3.1l1.3-1.3L6.7 2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Mail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" {...props}>
      <rect x="2.25" y="3.5" width="11.5" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
      <path d="m2.75 4.5 5.25 4 5.25-4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
