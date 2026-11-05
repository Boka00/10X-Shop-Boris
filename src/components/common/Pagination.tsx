interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void
}

export const Pagination = ({currentPage, totalPages, onPageChange}: PaginationProps) => {
    if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 pt-6"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      <div className="flex flex-wrap items-center gap-1.5">
        {pages.map((page)=> (
             <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-9 w-9 cursor-pointer rounded-xl text-xs font-bold transition-colors ${
                    page === currentPage
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
          {page}
        </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={()=> onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next →
      </button>
    </nav>
  );
};