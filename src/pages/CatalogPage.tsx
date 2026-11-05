import { useEffect, useMemo, useState } from "react"
import { fetchProducts } from "../api/products.api"
import type { Product } from "../types/product";
import { ProductGrid } from "../components/product/ProductGrid";
import { useCart } from "../context/CartContext";
import { useDebounce } from "../hooks/useDebounce";
import { discountPrice } from "../utils/format";
import { ProductFilters, type SortOption } from "../components/product/ProductFilters";
import { Pagination } from "../components/common/Pagination";

const ITEMS_PER_PAGE = 12;

 const CatalogPage = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { addItem } = useCart();

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

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);


  const filteredProducts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesSearch =
        query === "" ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "default") return filtered;

    return [...filtered].sort((a, b) => {
      const priceA = discountPrice(a.price, a.discountPercentage);
      const priceB = discountPrice(b.price, b.discountPercentage);

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "rating-desc") return b.rating - a.rating;
      return 0;
    });
  }, [products, debouncedSearch, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- Handlers (ფილტრის შეცვლისას გვერდს ვაბრუნებთ 1-ზე) ---
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
    setCurrentPage(1);
  };

const handleAddToCart = (product: Product): void => {
  addItem(product);
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
            Explore our curated collection of quality products
          </p>
        </div>

        {/* Inline Feedback Toast */}
        {feedback && (
          <div className="fixed top-16 right-6 z-100 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            {feedback}
          </div>
        )}
      </div>

      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        totalResults={filteredProducts.length}
        onReset={handleResetFilters}
      />

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-800">
            No products match your filters
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search query or category selection.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>

          <ProductGrid
            products={paginatedProducts}
            onAddToCart={handleAddToCart}
          />

          {/* TODO 8: ჩასვი Pagination კომპონენტი */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default CatalogPage