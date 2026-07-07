import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const pageNums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center items-center gap-1 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <RiArrowLeftSLine size={18} />
      </button>
      {pageNums.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
            n === page
              ? 'bg-zinc-900 text-white border border-zinc-900'
              : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <RiArrowRightSLine size={18} />
      </button>
    </div>
  );
}
