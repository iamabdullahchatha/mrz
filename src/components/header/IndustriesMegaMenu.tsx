"use client";

import type { MotionValue } from "framer-motion";
import Link from "next/link";
import type { MenuEntry } from "@/data/types";
import { ROUTES } from "@/lib/routes";
import { ArrowUpRight } from "./icons";
import { MegaIndexColumn } from "./MegaIndexColumn";
import { MegaPreviewCard } from "./MegaPreviewCard";
import { useAccentGlow } from "./useAccentGlow";
import { useActiveIndex } from "./useActiveIndex";
import { useMenuItems } from "./useMenuItems";
import styles from "./Header.module.css";

interface IndustriesMegaMenuProps {
  entries: MenuEntry[];
  initialIndex: number;
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  glow: MotionValue<string>;
  onNavigate: () => void;
}

/**
 * A different composition from Services: one generous sector column paired with a
 * larger preview card. Same visual language (icon rows + preview), different rhythm.
 */
export function IndustriesMegaMenu({ entries, initialIndex, nx, ny, glow, onNavigate }: IndustriesMegaMenuProps) {
  const [active, direction, setActive] = useActiveIndex(initialIndex);
  const { onKeyDown, itemProps } = useMenuItems(entries.length, setActive);
  useAccentGlow(glow, entries[active].accent);

  return (
    <div className={styles.ind} onKeyDown={onKeyDown}>
      <div className={styles.indCol}>
        <div className={styles.indHeadRow}>
          <p className={styles.idxHead} id="mega-industries-heading">
            Sectors
          </p>
          <Link href={ROUTES.industries} className={styles.indOverview} onClick={onNavigate}>
            Overview
            <ArrowUpRight />
          </Link>
        </div>
        <MegaIndexColumn
          heading=""
          headingId="mega-industries-heading"
          entries={entries}
          offset={0}
          activeIndex={active}
          itemProps={itemProps}
          onNavigate={onNavigate}
          layoutKey="ind"
        />
      </div>
      <MegaPreviewCard
        entries={entries}
        activeIndex={active}
        direction={direction}
        nx={nx}
        ny={ny}
        sizes="(max-width: 1280px) 48vw, 520px"
        label="Sector"
        onNavigate={onNavigate}
      />
    </div>
  );
}
