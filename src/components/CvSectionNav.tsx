"use client";

import { useEffect, useRef, useState } from "react";

type Section = { id: string; label: string };

export default function CvSectionNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const seenSections = useRef(new Set<string>());

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const updateActiveSection = () => {
      const atDocumentEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;

      if (atDocumentEnd) {
        const finalSection = elements.at(-1);
        if (finalSection) setActiveId(finalSection.id);
        return;
      }

      const marker = Math.min(window.innerHeight * 0.32, 240);
      let current = elements[0];

      for (const element of elements) {
        if (element.getBoundingClientRect().top <= marker) current = element;
      }

      if (current) setActiveId(current.id);
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

    elements.forEach((element) => revealObserver.observe(element));
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  const activeIndex = Math.max(0, sections.findIndex(({ id }) => id === activeId));

  return (
    <nav className="cv-section-nav" aria-label="CV sections">
      <p className="eyebrow">On this page</p>
      <div className="cv-nav-list">
        <span
          className="cv-nav-indicator"
          style={{ "--active-index": activeIndex } as React.CSSProperties}
          aria-hidden="true"
        />
        {sections.map(({ id, label }, index) => (
          <a
            href={`#${id}`}
            key={id}
            className={activeId === id ? "is-active" : undefined}
            aria-current={activeId === id ? "location" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
