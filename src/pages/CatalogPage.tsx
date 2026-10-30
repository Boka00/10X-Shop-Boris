import { useEffect, useState } from "react"
import { fetchProducts } from "../api/products.api"
import type { Product } from "../types/product";
import { ProductGrid } from "../components/product/ProductGrid";

 const CatalogPage = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(()=>{
  async function loadData() {
    try {
      setLoading(true)
      const data = await fetchProducts();
      setProducts(data.products);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }
  loadData();
},[]);

const handleAddToCart = (product: Product) => {
  setFeedback(`Added "${product.title}" to cart ✓`);
  setTimeout(() => setFeedback(null), 2500);
}
  if (loading) return <div className="py-16 text-center text-base font-medium text-slate-600">Loading products...</div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">Error: {error}</div>;
  if (products.length === 0) return <div className="py-16 text-center text-slate-500">No products found.</div>;


  return (
    <div className="space-y-6">
      {/* Header & Results Count */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Catalog
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Showing 1–{products.length} products
          </p>
        </div>

        {/* Inline Feedback Toast */}
        {feedback && (
          <div className="z-100 fixed right-6 top-16 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700">
            {feedback}
          </div>
        )}
      </div>
      {/* Product Grid — იხატება მხოლოდ ერთხელ! */}
         <ProductGrid products={products} onAddToCart={handleAddToCart}/>
    </div>
  )
}

export default CatalogPage