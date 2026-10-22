"use client";

import { useEffect, useRef, useState } from "react";

export type Section = { id: string; label: string };

type Props = {
  sections: Section[];
  download?: { href: string; label: string };
};

/**
 * "On this page" rail: a generalised CvSectionNav used by every page.
 * Scroll-spy, sliding indicator and one-time section reveal are unchanged
 * from the CV implementation. Renders nothing for fewer than two sections
 * (an almost-empty rail is noise).
 */
export default function SectionNav({ sections, download }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [strip, setStrip] = useState({ x: 0, w: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const seenSections = useRef(new Set<string>());

  useEffect(() => {
    if (sections.length < 2) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const updateActiveSection = () => {
      const atDocumentEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;

      let current = elements[0];
      if (atDocumentEnd) {
        current = elements.at(-1) ?? current;
      } else {
        const marker = Math.min(window.innerHeight * 0.32, 240);
        for (const element of elements) {
          if (element.getBoundingClientRect().top <= marker) current = element;
        }
      }
      if (!current) return;
      setActiveId(current.id);

      const list = listRef.current;
      const link = list?.querySelector<HTMLAnchorElement>(`a[href="#${current.id}"]`);
      if (list && link) {
        // The indicator is absolutely positioned inside the scrolling list, so it
        // already moves with the content; offsetLeft alone is the right x.
        const next = { x: link.offsetLeft, w: link.offsetWidth };
        setStrip((prev) => (prev.x === next.x && prev.w === next.w ? prev : next));
      }
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seenSections.current.has(entry.target.id)) continue;
          seenSections.current.add(entry.target.id);
          if (!reduceMotion) {
            entry.target.animate(
              [
                { opacity: 0.35, transform: "translateY(12px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" },
            );
          }
        }
      },
      { threshold: 0.12 },
    );

    // The header stacks on narrow screens, so measure it instead of assuming 68px.
    const header = document.querySelector<HTMLElement>(".site-header");
    const writeHeaderHeight = () => {
      if (header) {
        document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
      }
    };
    const headerObserver = header ? new ResizeObserver(writeHeaderHeight) : null;
    headerObserver?.observe(header as HTMLElement);
    writeHeaderHeight();

    elements.forEach((element) => revealObserver.observe(element));
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      revealObserver.disconnect();
      headerObserver?.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  if (sections.length < 2) return null;

  const activeIndex = Math.max(0, sections.findIndex(({ id }) => id === activeId));

  return (
    <nav className="rail-nav" aria-label="On this page">
      <p className="eyebrow">On this page</p>
      <div className="rail-list" ref={listRef}>
        <span
          className="rail-indicator"
          style={
            {
              "--active-index": activeIndex,
              "--x": `${strip.x}px`,
              "--w": `${strip.w}px`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
        {sections.map(({ id, label }) => (
          <a
            href={`#${id}`}
            key={id}
            className={activeId === id ? "is-active" : undefined}
            aria-current={activeId === id ? "location" : undefined}
          >
            {label}
          </a>
        ))}
      </div>
      {download && (
        <a className="download-link" href={download.href} target="_blank" rel="noreferrer">
          {download.label}
        </a>
      )}
    </nav>
  );
}
