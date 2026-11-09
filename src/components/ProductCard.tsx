"use client";

import Image from "next/image";
import type { MenuProduct } from "@/data/menu";

type Props = {
  product: MenuProduct;
  kind: "drink" | "snack" | "weekend";
  index: number;
  total: number;
  priority?: boolean;
};

export default function ProductCard({ product, kind, index, total, priority = false }: Props) {
  const editorial = kind !== "weekend";
  const itemNumber = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const optionsPrompt = product.options?.map((option) => option.label.toLowerCase()).join(" and ");
  return (
    <article className={`product-card${editorial ? ` editorial-card product-card--${kind}` : ""}`} data-product-id={product.id}>
      <div className="product-surface">
      {editorial && (
        <div className="card-meta">
          {kind === "snack" ? (
            <>
              <span className="card-index" aria-hidden="true">{itemNumber}</span>
              {product.piecesLabel ? <span className="product-quantity">{product.piecesLabel}</span> : <span aria-hidden="true">Snacks</span>}
            </>
          ) : (
            <><span aria-hidden="true">Calle Café</span><span className="card-index" aria-hidden="true">{itemNumber}</span></>
          )}
        </div>
      )}
      <div className="product-media">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes={editorial ? "(min-width: 1200px) 250px, (min-width: 1024px) 29vw, (min-width: 768px) 43vw, 75vw" : "(min-width: 1100px) 280px, (min-width: 768px) 44vw, 83vw"}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
      <div className="product-caption">
        <h4>{product.name}</h4>
        {product.priceLabel && <p className="product-price">{product.priceLabel}</p>}
        {kind === "snack" ? (
          product.prices?.map((price) => <p className="product-price" key={price.value}>{price.value}</p>)
        ) : product.prices && (
          <div className="product-prices">
            {product.prices.map((price) => (
              <div key={price.label ?? price.value}>
                {price.label && <p className="price-label">{price.label}</p>}
                <p className="product-price">{price.value}</p>
              </div>
            ))}
          </div>
        )}
        {product.description && <p className="product-description">{product.description}</p>}
      </div>
      </div>
        {product.options && (
          <details className="card-options">
            <summary>
              <span className="options-open-label">Click to see {optionsPrompt}</span>
              <span className="options-close-label">Back to item</span>
            </summary>
            <div className="card-back" onClick={(event) => {
              if (window.getSelection()?.toString()) return;
              const toggle = event.currentTarget.closest('details')?.querySelector('summary');
              toggle?.click();
              toggle?.focus({ preventScroll: true });
            }}>
              <p className="options-name">{product.name}</p>
              <dl className="product-options">
            {product.options.map((option) => (
              <div key={option.label}>
                <dt>{option.label}</dt>
                <dd><ul className="option-list">{option.values.map((value) => <li className="option-chip" key={value}>{value}</li>)}</ul></dd>
              </div>
            ))}
              </dl>
            </div>
          </details>
        )}
    </article>
  );
}
