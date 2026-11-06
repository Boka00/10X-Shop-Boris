import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import type { Product, Review } from "../types/product";
import { fetchProductById, fetchProductsByCategory } from "../api/products.api";
import { isApiError } from "../api/ApiError";
import { discountPrice, formatDate, formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { STORAGE_KEYS, StorageService } from "../models/StorageService";
import { ProductGrid } from "../components/product/ProductGrid";
import NotFound from "./NotFound";

type ReviewsMap = Record<string, Review[]>;

const reviewsStorage = new StorageService<ReviewsMap>(STORAGE_KEYS.reviews);

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const isValidId = Boolean(id && Number.isInteger(productId) && productId > 0);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(isValidId);
  const [notFound, setNotFound] = useState<boolean>(!isValidId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState<number>(0);

  const [quantity, setQuantity] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  // Reviews state (P3.4)
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>("");
  const [reviewError, setReviewError] = useState<string | null>(null);

  const { items, addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 2500);
  };

  useEffect(() => {
    if (!isValidId) return;

    const controller = new AbortController();

    async function loadProductDetails() {
      try {
        setLoading(true);
        setNotFound(false);
        setErrorMessage(null);

        const data = await fetchProductById(productId, controller.signal);
        if (controller.signal.aborted) return;

        setProduct(data);
        setSelectedImage(data.images?.[0] || data.thumbnail);
        setQuantity(1);

        const allSavedReviews = reviewsStorage.get() ?? {};
        setLocalReviews(allSavedReviews[String(productId)] ?? []);

        const relatedRes = await fetchProductsByCategory(
          data.category,
          5,
          controller.signal
        );
        if (!controller.signal.aborted) {
          setRelatedProducts(
            relatedRes.products.filter((p) => p.id !== data.id).slice(0, 4)
          );
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isApiError(err) && err.status === 404) {
          setNotFound(true);
        } else {
          setErrorMessage(
            isApiError(err)
              ? `Error ${err.status}: ${err.message}`
              : "Network error while loading product details."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProductDetails();

    return () => {
      controller.abort();
    };
  }, [productId, isValidId, reloadTick]);

  const allReviews = useMemo(() => {
    const apiReviews = product?.reviews ?? [];
    return [...localReviews, ...apiReviews];
  }, [localReviews, product?.reviews]);

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return product?.rating ?? 0;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / allReviews.length) * 10) / 10;
  }, [allReviews, product?.rating]);

  const handleAddToCart = () => {
    if (!product) return;

    const existingItem = items.find((item) => item.productId === product.id);
    const inCartQty = existingItem ? existingItem.quantity : 0;
    const remainingStock = product.stock - inCartQty;

    if (remainingStock <= 0) {
      showFeedback(
        `Cannot add more — maximum stock (${product.stock}) reached in cart`
      );
      return;
    }

    const qtyToAdd = Math.min(quantity, remainingStock);
    addItem(product, qtyToAdd);
    showFeedback(`Added ${qtyToAdd} item(s) to cart ✓`);
  };

  const handleReviewSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewError(null);

    if (ratingInput < 1 || ratingInput > 5) {
      setReviewError("Please select a rating");
      return;
    }
    if (commentInput.trim().length < 10) {
      setReviewError("Comment must be at least 10 characters");
      return;
    }

    const reviewerName = user.isLoggedIn
      ? user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.username
      : "Guest";

    const newReview: Review = {
      rating: ratingInput,
      comment: commentInput.trim(),
      date: new Date().toISOString(),
      reviewerName,
    };

    const nextLocal = [newReview, ...localReviews];
    setLocalReviews(nextLocal);

    const existingMap = reviewsStorage.get() ?? {};
    reviewsStorage.set({
      ...existingMap,
      [String(productId)]: nextLocal,
    });

    setCommentInput("");
    setRatingInput(5);
    showFeedback("Review added ✓");
  };

  if (!isValidId || notFound) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-base font-medium text-slate-600 dark:text-slate-400">
        Loading product details...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => setReloadTick((t) => t + 1)}
          className="mt-4 cursor-pointer rounded-xl bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
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
    <div className="space-y-10 py-4">
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-md"
        >
          {feedback}
        </div>
      )}

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-300"
        >
          ← Back to catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
            <img
              src={selectedImage}
              alt={product.title}
              width={600}
              height={600}
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
              {galleryImages.map((imgUrl, idx) => (
                <button
                  type="button"
                  key={imgUrl}
                  aria-label={`View image ${idx + 1} of ${product.title}`}
                  aria-pressed={selectedImage === imgUrl}
                  className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-slate-50 transition-all ${
                    selectedImage === imgUrl
                      ? "border-indigo-600 ring-2 ring-indigo-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    width={80}
                    height={80}
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
              <Link to={`/?category=${product.category}`} className="hover:underline">
                {product.category}
              </Link>
              {product.brand && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {product.brand}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {product.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                <span>★ {averageRating}</span>
                <span className="text-xs text-slate-500">
                  ({allReviews.length} reviews)
                </span>
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
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(finalPrice)}
              </span>

              {hasDiscount && (
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Quantity:
              </span>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((prev) => prev - 1)}
                  disabled={isOutOfStock || quantity <= 1}
                  className="cursor-pointer px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200"
                >
                  −
                </button>

                <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="cursor-pointer px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200"
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
        </div>
      </div>

      {/* Reviews Section (P3.4) */}
      <section className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Customer Reviews ({allReviews.length})
          </h2>
          {allReviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {allReviews.map((rev, index) => (
                <div key={`${rev.reviewerName}-${rev.date}-${index}`} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {rev.reviewerName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDate(rev.date)}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-amber-500">
                    {"★".repeat(rev.rating)}{"☆".repeat(Math.max(0, 5 - rev.rating))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleReviewSubmit} noValidate className="space-y-4 border-t border-slate-100 pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Write a review
          </h3>
          <div>
            <label htmlFor="ratingSelect" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Rating
            </label>
            <select
              id="ratingSelect"
              value={ratingInput}
              onChange={(e) => setRatingInput(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Good</option>
              <option value={3}>3 Stars - Average</option>
              <option value={2}>2 Stars - Fair</option>
              <option value={1}>1 Star - Poor</option>
            </select>
          </div>

          <div>
            <label htmlFor="reviewComment" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Comment
            </label>
            <textarea
              id="reviewComment"
              rows={3}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Share your experience (min 10 chars)..."
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {reviewError && (
            <p className="text-xs font-medium text-red-600">{reviewError}</p>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Submit Review
          </button>
        </form>
      </section>

      {/* Related Products (P3.5) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Related Products
          </h2>
          <ProductGrid
            products={relatedProducts}
            onAddToCart={(p) => {
              addItem(p, 1);
              showFeedback(`Added ${p.title} to cart ✓`);
            }}
          />
        </section>
      )}
    </div>
  );
};

export default ProductPage;