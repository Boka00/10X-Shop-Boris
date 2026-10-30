import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product"
import { discountPrice, formatPrice } from "../../utils/format";

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void
}

const ProductCard = ({product, onAddToCart}: ProductCardProps) => {
    const navigate = useNavigate();

    const finalPrice = discountPrice(product.price, product.discountPercentage);

    const hasDiscount = product.discountPercentage >= 1;

    const isOutOfStock = product.stock === 0;

    const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
        onClick={() => navigate(`/products/${product.id}`)}
        className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
        >
        <div className="w-100 grid grid-cols-2">
            {/* Product Image (width/height და lazy loading CLS-ის წინააღმდეგ) */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
            <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            width="300"
            height="300"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            {hasDiscount && (
            <span className="absolute top-2 left-2 rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                -{Math.round(product.discountPercentage)}%
            </span>
            )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4">
            <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {product.category} {product.brand ? `• ${product.brand}` : ''}
            </p>
            <h3 className="mt-1 text-sm font-semibold text-slate-900 line-clamp-1">
                {product.title}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                <span>★</span>
                <span className="font-medium text-slate-700">{product.rating}</span>
            </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
            {/* Prices */}
            <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900">
                {formatPrice(finalPrice)}
                </span>
                {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                    {formatPrice(product.price)}
                </span>
                )}
            </div>

            {/* Stock Status Badge */}
            <span
                className={`text-xs font-medium ${
                isOutOfStock
                    ? 'text-red-600'
                    : isLowStock
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
            >
                {isOutOfStock
                ? 'Out of stock'
                : isLowStock
                ? `Only ${product.stock} left!`
                : 'In stock'}
            </span>
            </div>

            {/* Add to Cart Button */}
            <button
            type="button"
            disabled={isOutOfStock}
            onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
            }}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
            {isOutOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
        </div>
        </div>
        
    </div>
  );
}

export default ProductCard