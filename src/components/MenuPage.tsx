import { ArrowUp } from "lucide-react";
import { menuCategories } from "@/data/menu";
import FloatingHeader from "./FloatingHeader";
import ProductSlider from "./ProductSlider";

function CatMark() {
  return (
    <svg className="welcome-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.1 10.4 4.4 5l4 2.2a8.1 8.1 0 0 1 7.2 0L19.6 5l-.7 5.4c.5.9.8 1.9.8 3 0 3.9-3.5 6.6-7.7 6.6S4.3 17.3 4.3 13.4c0-1.1.3-2.1.8-3Z" />
      <circle cx="9.4" cy="12.1" r=".7" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="12.1" r=".7" fill="currentColor" stroke="none" />
      <path d="M10.9 14.5h2.2l-1.1 1.2-1.1-1.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const sections = [
  { id: "drinks", title: "Drinks.", eyebrow: "01 / THE MENU", note: "Good sips. Good company." },
  { id: "snacks", title: "Snacks.", eyebrow: "02 / A LITTLE SOMETHING TO EAT", note: "A little bite. A little longer here." },
  { id: "weekend-cocktails", title: "Weekend Cocktails.", eyebrow: "03 / THE WEEKEND", note: "Make a little room for the weekend." },
];

export default function MenuPage() {
  return (
    <>
      <a className="skip-link" href="#drinks">Skip to the menu</a>
      <div id="top" />
      <FloatingHeader />
      <main>
        <div className="welcome page-container">
          <div>
            <p className="eyebrow"><span className="welcome-dot" aria-hidden="true" />Welcome to Calle</p>
            <h1>Something good<br />is <em>waiting.</em></h1>
          </div>
          <p className="welcome-note">Take a look around.<br className="welcome-note-break" />{" "}Find your comfort.<CatMark /></p>
        </div>

        {sections.map((section) => (
          <section key={section.id} id={section.id} className={`menu-section ${section.id === "weekend-cocktails" ? "weekend-section" : ""}`} aria-labelledby={`${section.id}-heading`}>
            <div className="page-container">
              <div className="section-intro">
                <div>
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2 id={`${section.id}-heading`}>{section.title}</h2>
                </div>
                <p className="section-note">{section.note}</p>
              </div>
              {menuCategories.filter((category) => category.section === section.id).map((category) => (
                <ProductSlider key={category.id} id={category.id} title={category.title} products={category.products} />
              ))}
            </div>
          </section>
        ))}
      </main>
      <footer className="page-container calle-footer">
        <div>
          <p className="eyebrow">A little comfort, at Calle.</p>
          <p className="footer-signoff">Made for slow days<br />and good company.</p>
        </div>
        <a href="#top" className="back-to-top">Back to top <ArrowUp size={18} aria-hidden="true" /></a>
        <div className="footer-bottom"><span>Calle Café</span><span>The neighborhood menu</span></div>
      </footer>
    </>
  );
}
