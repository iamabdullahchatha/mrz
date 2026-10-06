"use client";

import type { MotionValue } from "framer-motion";
import type { MenuEntry } from "@/data/types";
import { ROUTES } from "@/lib/routes";
import { MegaIndexColumn } from "./MegaIndexColumn";
import { MegaPreviewCard } from "./MegaPreviewCard";
import { useAccentGlow } from "./useAccentGlow";
import { useActiveIndex } from "./useActiveIndex";
import { useMenuItems } from "./useMenuItems";
import styles from "./Header.module.css";

interface ServicesMegaMenuProps {
  entries: MenuEntry[];
  initialIndex: number;
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  glow: MotionValue<string>;
  onNavigate: () => void;
}

/**
 * Reference composition: two index columns (Service Index + Continued) and a
 * preview card. Hovering or focusing any row re-targets the preview; roving keys
 * move through all entries across both columns.
 */
export function ServicesMegaMenu({ entries, initialIndex, nx, ny, glow, onNavigate }: ServicesMegaMenuProps) {
  const [active, direction, setActive] = useActiveIndex(initialIndex);
  const { onKeyDown, itemProps } = useMenuItems(entries.length, setActive);
  useAccentGlow(glow, entries[active].accent);

  const split = Math.ceil(entries.length / 2);
  const first = entries.slice(0, split);
  const second = entries.slice(split);

  return (
    <div className={styles.svc} onKeyDown={onKeyDown}>
      <MegaIndexColumn
        heading="Service Index"
        headingId="mega-services-heading"
        entries={first}
        offset={0}
        activeIndex={active}
        itemProps={itemProps}
        onNavigate={onNavigate}
        layoutKey="svc-a"
        action={{ label: "View all services", href: ROUTES.services }}
      />
      <MegaIndexColumn
        heading="Continued"
        headingId="mega-services-heading-b"
        entries={second}
        offset={split}
        activeIndex={active}
        itemProps={itemProps}
        onNavigate={onNavigate}
        layoutKey="svc-b"
      />
      <MegaPreviewCard
        entries={entries}
        activeIndex={active}
        direction={direction}
        nx={nx}
        ny={ny}
        sizes="(max-width: 1280px) 40vw, 420px"
        label="Service"
        onNavigate={onNavigate}
      />
    </div>
  );
}
