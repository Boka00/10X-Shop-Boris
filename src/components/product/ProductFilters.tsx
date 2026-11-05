export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

// TODO 1: შეავსე ProductFiltersProps ინტერფეისი
interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
  onReset: () => void;
}

export const ProductFilters = ({ 
  searchQuery, onSearchChange, 
  selectedCategory, onCategoryChange, 
  categories, sortBy, onSortChange, 
  totalResults, onReset 
}:ProductFiltersProps) => {


  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || sortBy !== 'default';

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* 1. Search Input (takes 2 columns on desktop) */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Search Products
          </label>

          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e)=> onSearchChange(e.target.value)}
            placeholder="Search by title or description..."
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
        </div>

        {/* 2. Category Select */}
        <div>
          <label htmlFor="category" className="block text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Category
          </label>
      
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-1.5 w-full cursor-pointer rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 capitalize transition-colors focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          >
            <option value="all">All Categories</option>
           { categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )) }
          </select>
        </div>

        {/* 3. Sort Select */}
        <div>
          <label htmlFor="sort" className="block text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="mt-1.5 w-full cursor-pointer rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Results Count & Reset Button */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>
          Showing <strong className="font-semibold text-slate-800">{totalResults}</strong> products
        </span>

        {hasActiveFilters && (
           <button
          type="button"
          onClick={onReset}
          className="cursor-pointer font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
        >
          Reset filters ✕
        </button>
        )}
      </div>
    </div>
  );
};