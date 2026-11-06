import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../types/product";
import { fetchProductById } from "../api/products.api";
import { discountPrice, formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import NotFound from "./NotFound";

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const isValidId = Boolean(id && Number.isInteger(productId) && productId > 0);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(isValidId);
  const [notFound, setNotFound] = useState<boolean>(!isValidId);

  const [quantity, setQuantity] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { items, addItem } = useCart();

  const handleAddToCart = () => {
    if (!product) return;

    const existingItem = items.find((item) => item.productId === product.id);
    const inCartQty = existingItem ? existingItem.quantity : 0;
    const remainingStock = product.stock - inCartQty;

    if (remainingStock <= 0) {
      setFeedback(`Cannot add more — maximum stock (${product.stock}) reached in cart`);
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    const qtyToAdd = Math.min(quantity, remainingStock);
    addItem(product, qtyToAdd);
    setFeedback(`Added ${qtyToAdd} item(s) to cart ✓`);
    setTimeout(() => {
      setFeedback(null);
    }, 2500);
  };

  useEffect(() => {
    if (!isValidId) return;

    const controller = new AbortController();

    async function loadProduct() {
      try {
        setLoading(true);
        setNotFound(false);

        const data = await fetchProductById(productId, controller.signal);
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.thumbnail);
        setQuantity(1);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setNotFound(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [productId, isValidId]);

  if (!isValidId || notFound) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-base font-medium text-slate-600">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return <NotFound />;
  }

  const finalPrice = discountPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage >= 1;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  return (
    <div className="space-y-6 py-4">
      {feedback && (
        <div className="fixed top-20 right-6 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-md">
          {feedback}
        </div>
      )}

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
        >
          ← Back to catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-8">
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <img
              src={selectedImage}
              alt={product.title}
              width="600"
              height="600"
              className="h-full w-full object-contain p-4"
            />

            {hasDiscount && (
              <span className="absolute top-3 left-3 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgUrl) => (
                <button
                  type="button"
                  key={imgUrl}
                  className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-slate-50 transition-all ${
                    selectedImage === imgUrl
                      ? "border-indigo-600 ring-2 ring-indigo-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={product.title}
                    width="80"
                    height="80"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
              <span>{product.category}</span>
              {product.brand && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600">{product.brand}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {product.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                <span className="text-amber-500">★</span>
                <span>{product.rating}</span>
              </div>

              <span
                className={`text-sm font-medium ${
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

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {formatPrice(finalPrice)}
              </span>

              {hasDiscount && (
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="border-t border-slate-100 pt-2 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Quantity:</span>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev - 1)}
                  disabled={isOutOfStock || quantity <= 1}
                  className="cursor-pointer px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  -
                </button>

                <span className="w-10 text-center text-sm font-semibold text-slate-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="cursor-pointer px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOutOfStock ? "Out of stock" : "Add to cart"}
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
            SKU ID: #{product.id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;