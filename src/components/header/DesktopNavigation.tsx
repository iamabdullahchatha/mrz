"use client";

import { LayoutGroup } from "framer-motion";
import { useState, type KeyboardEvent } from "react";
import { primaryNav, type MegaMenuId } from "@/data/navigation";
import { NavItem } from "./NavItem";
import type { MegaMenuController } from "./useMegaMenu";
import styles from "./Header.module.css";

interface DesktopNavigationProps {
  pathname: string;
  menu: MegaMenuController;
  /** Moves focus to the first item of the given menu's panel. */
  focusPanel: (id: MegaMenuId) => void;
  onNavigate: () => void;
}

export function DesktopNavigation({ pathname, menu, focusPanel, onNavigate }: DesktopNavigationProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  // The hover pill rests on the open menu's trigger while the pointer is inside the panel.
  const highlightId = hovered ?? menu.openId;

  const openAndFocus = (id: MegaMenuId) => {
    menu.open(id);
    // Panel mounts on the next frame.
    requestAnimationFrame(() => requestAnimationFrame(() => focusPanel(id)));
  };

  const onTriggerKeyDown = (id: MegaMenuId) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openAndFocus(id);
    } else if (e.key === "Tab" && !e.shiftKey && menu.openId === id) {
      // The panel renders after the bar in DOM order; route Tab into it so it reads as a disclosure.
      e.preventDefault();
      focusPanel(id);
    }
  };

  // Left / Right move between top-level items.
  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-nav-item]"));
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next].focus();
  };

  return (
    <nav className={styles.desktopNav} aria-label="Primary">
      <LayoutGroup id="desktop-nav">
        <ul className={styles.navList} onPointerLeave={() => setHovered(null)} onKeyDown={onListKeyDown}>
          {primaryNav.map((item) => {
            const isMega = item.kind === "mega";
            return (
              <NavItem
                key={item.id}
                item={item}
                active={item.match(pathname)}
                expanded={isMega && menu.openId === item.id}
                highlighted={highlightId === item.id}
                onHover={() => setHovered(item.id)}
                onTriggerPointerEnter={(e) => {
                  if (e.pointerType === "mouse" && isMega) menu.hoverTrigger(item.id);
                }}
                onTriggerPointerLeave={menu.cancelPendingOpen}
                onTriggerClick={() => isMega && menu.toggle(item.id)}
                onTriggerKeyDown={isMega ? onTriggerKeyDown(item.id) : () => {}}
                onLinkPointerEnter={() => menu.scheduleClose(160)}
                onNavigate={onNavigate}
              />
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
