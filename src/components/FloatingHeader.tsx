"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const sections = ["drinks", "snacks", "weekend-cocktails"] as const;

export default function FloatingHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>("drinks");

  useEffect(() => {
    function updateActiveSection() {
      const threshold = (headerRef.current?.getBoundingClientRect().bottom ?? 0) + 24;
      let active: string = sections[0];
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold + 1) active = id;
      }
      setActiveSection(active);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header className="floating-header" ref={headerRef}>
      <a className="brand-link" href="#top" aria-label="Calle Café — back to top">
        <Image src="/images/branding/calle-logo-transparent.webp" alt="Calle Café" width={128} height={128} className="brand-image" preload />
      </a>
      <nav aria-label="Menu sections">
        <a href="#drinks" aria-current={activeSection === "drinks" ? "location" : undefined}>Drinks</a>
        <a href="#snacks" aria-current={activeSection === "snacks" ? "location" : undefined}>Snacks</a>
        <a href="#weekend-cocktails" aria-current={activeSection === "weekend-cocktails" ? "location" : undefined}>Weekend Cocktails</a>
      </nav>
    </header>
  );
}
