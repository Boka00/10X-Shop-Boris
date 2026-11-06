import { memo } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { discountPrice, formatPrice } from "../../utils/format";

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
  const finalPrice = discountPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage >= 1;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <Link
          to={`/products/${product.id}`}
          className="relative block aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            width={300}
            height={300}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </Link>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {product.category}
              {product.brand ? ` • ${product.brand}` : ""}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
              <svg className="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.rating}
            </span>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="line-clamp-1 block text-base font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
          >
            {product.title}
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <span
            className={`text-xs font-semibold ${
              isOutOfStock
                ? "text-red-600"
                : isLowStock
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {isOutOfStock
              ? "Out of stock"
              : isLowStock
              ? `Only ${product.stock} left!`
              : "In stock"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className="w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
});

export default ProductCard;