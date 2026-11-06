import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/products.api";
import { isApiError } from "../api/ApiError";
import type { AsyncState } from "../types/api";
import type { Product, SortOption } from "../types/product";
import { useCart } from "../context/CartContext";
import { useDebounce } from "../hooks/useDebounce";
import { ProductGrid } from "../components/product/ProductGrid";
import { ProductFilters } from "../components/product/ProductFilters";
import { Pagination } from "../components/common/Pagination";
import { discountPrice } from "../utils/format";

const ITEMS_PER_PAGE = 12;

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";
  const sortBy = (searchParams.get("sort") ?? "") as SortOption;
  const currentPage = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const [searchInput, setSearchInput] = useState<string>(urlQuery);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [catalogState, setCatalogState] = useState<AsyncState<Product[]>>({
    status: "loading",
  });
  const [reloadTick, setReloadTick] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const { items, addItem } = useCart();

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Sync debounced search input to URL ?q=...
  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed === urlQuery) return;

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (trimmed) {
          next.set("q", trimmed);
          next.delete("category");
        } else {
          next.delete("q");
        }
        next.set("page", "1");
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, urlQuery, setSearchParams]);

  // Fetch complete catalog with AbortController
  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      setCatalogState({ status: "loading" });
      try {
        const data = await fetchProducts(0, 0, controller.signal);
        if (!controller.signal.aborted) {
          setCatalogState({ status: "success", data: data.products });
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message = isApiError(err)
          ? `Server error (${err.status}): ${err.message}`
          : "Failed to load products. Please check your connection.";
        if (!controller.signal.aborted) {
          setCatalogState({ status: "error", message });
        }
      }
    }

    loadCatalog();

    return () => {
      controller.abort();
    };
  }, [reloadTick]);

  const products = useMemo(
    () => (catalogState.status === "success" ? catalogState.data : []),
    [catalogState]
  );

  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => {
      if (p.category) unique.add(p.category);
    });
    return Array.from(unique).sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (urlQuery) {
      const q = urlQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    } else if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === "price-asc") {
      result.sort(
        (a, b) =>
          discountPrice(a.price, a.discountPercentage) -
          discountPrice(b.price, b.discountPercentage)
      );
    } else if (sortBy === "price-desc") {
      result.sort(
        (a, b) =>
          discountPrice(b.price, b.discountPercentage) -
          discountPrice(a.price, a.discountPercentage)
      );
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "title-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, urlQuery, selectedCategory, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, safePage]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      const existing = items.find((i) => i.productId === product.id);
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty >= product.stock) {
        showToast(`Maximum stock (${product.stock}) reached in cart`);
        return;
      }
      addItem(product, 1);
      showToast("Added to cart ✓");
    },
    [items, addItem, showToast]
  );

  const handleCategoryChange = (category: string) => {
    setSearchInput("");
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("q");
      if (category) {
        next.set("category", category);
      } else {
        next.delete("category");
      }
      next.set("page", "1");
      return next;
    });
  };

  const handleSortChange = (sort: SortOption) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (sort) {
        next.set("sort", sort);
      } else {
        next.delete("sort");
      }
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  return (
    <div className="space-y-6 py-4">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-md"
        >
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Catalog
        </h1>
        {catalogState.status === "success" && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            {filteredAndSortedProducts.length === 0
              ? 0
              : (safePage - 1) * ITEMS_PER_PAGE + 1}
            –
            {Math.min(
              safePage * ITEMS_PER_PAGE,
              filteredAndSortedProducts.length
            )}{" "}
            of {filteredAndSortedProducts.length} products
          </p>
        )}
      </div>

      <ProductFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onReset={handleResetFilters}
      />

      {catalogState.status === "loading" && (
        <div className="py-16 text-center text-base font-medium text-slate-600 dark:text-slate-400">
          Loading products...
        </div>
      )}

      {catalogState.status === "error" && (
        <div className="mx-auto my-12 max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/50">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            {catalogState.message}
          </p>
          <button
            type="button"
            onClick={() => setReloadTick((t) => t + 1)}
            className="mt-4 cursor-pointer rounded-xl bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {catalogState.status === "success" &&
        (paginatedProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No products found.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <ProductGrid
              products={paginatedProducts}
              onAddToCart={handleAddToCart}
            />
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ))}
    </div>
  );
};

export default CatalogPage;