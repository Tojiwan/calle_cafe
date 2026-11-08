import Image from "next/image";

export default function FloatingHeader() {
  return (
    <header className="floating-header">
      <a className="brand-link" href="#top" aria-label="Calle Café — back to top">
        <Image src="/images/branding/calle-logo.webp" alt="Calle Café" width={128} height={128} className="brand-image" preload />
      </a>
      <span className="header-note">The neighborhood menu</span>
      <nav aria-label="Menu sections">
        <a href="#drinks">Drinks</a>
        <a href="#snacks">Snacks</a>
        <a href="#weekend-cocktails">Weekend <span>Cocktails</span></a>
      </nav>
    </header>
  );
}
