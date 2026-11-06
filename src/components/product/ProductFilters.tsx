import type { SortOption } from "../../types/product";

export interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

export const ProductFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  onReset,
}: ProductFiltersProps) => {
  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "" || sortBy !== "";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Search Input */}
        <div className="md:col-span-5">
          <label htmlFor="catalog-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products by title or brand..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Category Select */}
        <div className="md:col-span-3">
          <label htmlFor="catalog-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="catalog-category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select (PRD P2.6) */}
        <div className="md:col-span-3">
          <label htmlFor="catalog-sort" className="sr-only">
            Sort products
          </label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating-desc">Rating: high to low</option>
            <option value="title-asc">Name A→Z</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-center md:col-span-1">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            title="Clear all filters"
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;