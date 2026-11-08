import Image from "next/image";
import type { MenuProduct } from "@/data/menu";

export default function ProductCard({ product, priority = false }: { product: MenuProduct; priority?: boolean }) {
  return (
    <article className="product-card" data-product-id={product.id}>
      <div className="product-media">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1100px) 280px, (min-width: 768px) 44vw, 83vw"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
      <div className="product-caption">
        <h4>{product.name}</h4>
        {product.priceLabel && <p className="product-price">{product.priceLabel}</p>}
        {product.description && <p className="product-description">{product.description}</p>}
      </div>
    </article>
  );
}
