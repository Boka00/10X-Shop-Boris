import { useEffect, useState } from 'react';
import { Link, useParams} from 'react-router-dom';
import type { Product } from '../types/product';
import { fetchProductById } from '../api/products.api';
import { discountPrice, formatPrice } from '../utils/format';
import { useCart } from '../context/CartContext';

export const ProductPage = () => {
  
  const { id } = useParams<{id: string}>();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null)

  const { addItem } = useCart();
  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setFeedback(`Added ${quantity} item(s) to cart ✓`)
    setTimeout(() => {
      setFeedback(null)
    }, 2500);
  }


  useEffect(()=>{
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        if(!id || Number.isNaN(productId) || productId <=0 ){
          throw new Error("Invalid Product ID");
        }

        const data = await fetchProductById(productId)
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.thumbnail)
        setQuantity(1);

      }catch(error: unknown){
        setError(error instanceof Error ? error.message : "Product not found")
      }finally{
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, productId])

  // --- 1. Loading State UI ---

  if(loading){
      return (
        <div className="py-16 text-center text-base font-medium text-slate-600">
        Loading product details...
      </div>
    );
  }

  // --- 2. Error / Not Found State UI ---

  if (error || !product){

      return (
        <div className="mx-auto my-10 max-w-md rounded-2xl border border-red-400 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">
          {error ?? 'The product you are looking for does not exist.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
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
      : [product.thumbnail]

  return (
    <div className="space-y-6 py-4">
      {feedback && (
        <div className="fixed top-20 right-6 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-md">
          {feedback}
        </div>
      )}
      {/* Back Link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
        >
          ← Back to catalog
        </Link>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-8">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            
            <img
              src={selectedImage}
              alt={product.title}
              width="600"
              height="600"
              className="h-full w-full object-contain p-4"
            />
    
           {hasDiscount &&  <span className="absolute top-3 left-3 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
              -{Math.round(product.discountPercentage)}%
            </span>}
          </div>

      
          {galleryImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((imgUrl)=> (
              <button 
              type='button'
              key={imgUrl}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 transition-all cursor-pointer ${
                    selectedImage === imgUrl
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
              onClick={()=> setSelectedImage(imgUrl)}>
                <img 
                  src={imgUrl} 
                  alt={product.title} 
                  width="80"
                  height="80"
                  loading="lazy"
                  className='h-full w-full object-cover' />
              </button>
            ))}
          </div>)}
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Brand */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
              <span>{product.category}</span>
              {product.brand && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{product.brand}</span>
                  </>
              )}
            </div>

            {/* Title */}
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
            <p className="border-t border-slate-100 pt-2 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </div>

                  {/* Stepper & Add to Cart Action */}
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Quantity:</span>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white">
    
                <button
                  type="button"
                  onClick={() => setQuantity((prev => prev - 1))}
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
                  onClick={()=> setQuantity((prev => prev + 1 ))}
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
              {isOutOfStock ? 'Out of stock' : `Add ${quantity} to cart`}
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