import { ArrowUp, Sparkles } from "lucide-react";
import { menuCategories } from "@/data/menu";
import FloatingHeader from "./FloatingHeader";
import ProductSlider from "./ProductSlider";

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
          <p className="welcome-note">Take a look around.<br />Find your comfort.<Sparkles size={26} strokeWidth={1} aria-hidden="true" /></p>
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
