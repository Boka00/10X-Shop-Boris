import { useEffect, useState } from "react"
import { fetchProducts } from "../api/products.api"
import type { Product } from "../types/product";

 const CatalogPage = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="py-10 text-center text-slate-600">Loading products...</div>;
  if (error) return <div className="py-10 text-center text-red-600">Error: {error}</div>;
  if (products.length === 0) return <div className="py-10 text-center text-slate-500">No products found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Catalog</h1>
      <p className="mt-2 text-slate-600">Products will be loaded here in Day 4.</p>
      <ul>
        {products.map((product)=>(
          <li className="grid grid-cols-3 rounded border border-slate-200 bg-white p-3 text-sm" key={product.id}>
            <span className="text-slate-500">{product.id}</span>
            <img className="h-12 w-12 rounded object-cover" src={product.thumbnail} alt={product.title} />
            <span className="font-medium">{product.title}</span>
            <span className="text-slate-500">{product.brand ?? product.category}</span>
            <span className="font-semibold">${product.price}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CatalogPage