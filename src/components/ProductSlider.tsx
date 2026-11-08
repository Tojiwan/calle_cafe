"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import type { MenuProduct } from "@/data/menu";
import ProductCard from "./ProductCard";
import "swiper/css";
import "swiper/css/a11y";

type Props = { id: string; title: string; products: MenuProduct[] };

export default function ProductSlider({ id, title, products }: Props) {
  const editorial = id !== "weekend-cocktails";
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [position, setPosition] = useState({ beginning: true, end: false, locked: false, first: 1, last: 1, ready: false });

  function sync(swiper: SwiperInstance) {
    const visible = swiper.slidesGrid.flatMap((offset, index) => {
      const left = offset + swiper.translate;
      // Allow subpixel rounding, but exclude the partial next/previous card preview.
      return left >= -1 && left + swiper.slidesSizesGrid[index] <= swiper.size + 1 ? [index + 1] : [];
    });
    setPosition({
      beginning: swiper.isBeginning, end: swiper.isEnd, locked: swiper.isLocked,
      first: visible[0] ?? swiper.activeIndex + 1,
      last: visible.at(-1) ?? swiper.activeIndex + 1,
      ready: true,
    });
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (swiperRef.current) swiperRef.current.params.speed = preference.matches ? 0 : 300;
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  function move(direction: "previous" | "next") {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const speed = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 300;
    if (direction === "previous") swiper.slidePrev(speed);
    else swiper.slideNext(speed);
  }

  return (
    <section
      className={`product-slider${editorial ? " product-slider--editorial" : ""}`}
      id={id === "snacks" || id === "weekend-cocktails" ? `${id}-products` : id}
      aria-labelledby={`${id}-title`}
      data-slider-id={id}
      onKeyDown={(event) => {
        if (event.target !== swiperRef.current?.el || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? "previous" : "next");
        }
      }}
    >
      <div className="slider-heading">
        <h3 id={`${id}-title`}>{title}<span className="product-count">{String(products.length).padStart(2, "0")}</span></h3>
        <div className="slider-controls" hidden={position.locked || products.length < 2}>
          <button type="button" aria-label={`Previous ${title} products`} aria-controls={`${id}-track`} disabled={!position.ready || position.beginning} onClick={() => move("previous")}>
            <ArrowLeft size={19} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" aria-label={`Next ${title} products`} aria-controls={`${id}-track`} disabled={!position.ready || position.end} onClick={() => move("next")}>
            <ArrowRight size={19} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <Swiper
        id={`${id}-track`}
        modules={[A11y]}
        slidesPerView="auto"
        spaceBetween={16}
        breakpoints={{ 768: { spaceBetween: 24 } }}
        watchOverflow
        speed={300}
        grabCursor
        tabIndex={0}
        role="group"
        aria-label={`${title} products`}
        a11y={{ slideLabelMessage: "{{index}} of {{slidesLength}}", scrollOnFocus: false }}
        onSwiper={(swiper) => { swiperRef.current = swiper; sync(swiper); }}
        onSlideChange={sync}
        onSetTranslate={sync}
        onUpdate={sync}
        onResize={sync}
        onLock={sync}
        onUnlock={sync}
        onToEdge={sync}
        onFromEdge={sync}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} kind={!editorial ? "weekend" : id === "snacks" ? "snack" : "drink"} index={index} total={products.length} priority={id === "coffee-based" && index === 0} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="slider-footnote">
        {editorial && (
          <div className="slider-progress" aria-hidden="true" hidden={!position.ready}>
            <div className="slider-progress-fill" style={{ width: `${Math.min(1, position.last / products.length) * 100}%` }} />
          </div>
        )}
        <span className="slider-position" role="status" aria-live="polite" aria-atomic="true" aria-label={`${title}: ${position.first === position.last ? `product ${position.first}` : `products ${position.first} through ${position.last}`} of ${products.length}`}>
          {String(position.first).padStart(2, "0")}{position.last !== position.first && `–${String(position.last).padStart(2, "0")}`} <span aria-hidden="true">/</span> {String(products.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
