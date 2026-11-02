import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProductById } from '../api/products.api';
import type { Product } from '../types/product';
import { discountPrice, formatPrice } from '../utils/format';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        if(!id || Number.isNaN(productId) || productId <= 0){
          throw new Error("Invalid product ID");
        }
        
        const data = await fetchProductById(productId);
        setProduct(data);
        setSelectedImage(data.images?.[0] || data?.thumbnail);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Product not found');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, productId]);

  if (loading) {
    return (
      <div className="py-16 text-center text-base font-medium text-slate-600">
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm my-10">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">
          {error ?? 'The product you are looking for does not exist.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          ← Back to Catalog
        </Link>
      </div>
    );
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
      {/* Back Link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          ← Back to catalog
        </Link>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-8">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
            <img
              src={selectedImage || product.thumbnail}
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

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={imgUrl}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 transition-all cursor-pointer ${
                    selectedImage === imgUrl
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} view ${index + 1}`}
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

        {/* Right Column: Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
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

            {/* Rating & Stock Badge */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                <span className="text-amber-500">★</span>
                <span>{product.rating}</span>
              </div>

              <span
                className={`text-sm font-medium ${
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
                  ? `Only ${product.stock} left in stock!`
                  : `In stock (${product.stock} available)`}
              </span>
            </div>

            {/* Price Block */}
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

            {/* Description */}
            <p className="text-sm leading-relaxed text-slate-600 pt-2 border-t border-slate-100">
              {product.description}
            </p>
          </div>

          {/* მე-2 კომიტში აქ ჩავსვამთ Quantity Stepper-ს და Add to Cart ღილაკს */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
            SKU ID: #{product.id}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;