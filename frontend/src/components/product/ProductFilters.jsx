import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

export default function ProductFilters({ filters, onChange }) {
  const { items: categories } = useSelector((s) => s.categories);
  const [priceOpen, setPriceOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-6">
      <h3 className="text-sm font-semibold text-zinc-900">Filters</h3>

      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Category</p>
        <div className="space-y-1">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer py-1 group">
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${!filters.category ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300 group-hover:border-zinc-400'}`}>
              {!filters.category && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
            </span>
            <input type="radio" name="category" value="" checked={!filters.category} onChange={() => onChange({ category: '' })} className="sr-only" />
            <span className={!filters.category ? 'text-zinc-900 font-medium' : 'text-zinc-600'}>All</span>
          </label>
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2.5 text-sm cursor-pointer py-1 group">
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${filters.category === c._id ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300 group-hover:border-zinc-400'}`}>
                {filters.category === c._id && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </span>
              <input type="radio" name="category" value={c._id} checked={filters.category === c._id} onChange={() => onChange({ category: c._id })} className="sr-only" />
              <span className={filters.category === c._id ? 'text-zinc-900 font-medium' : 'text-zinc-600'}>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <button
          className="flex items-center justify-between w-full text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3"
          onClick={() => setPriceOpen(!priceOpen)}
        >
          Price Range {priceOpen ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
        </button>
        {priceOpen && (
          <div className="flex gap-2">
            <input
              type="number" placeholder="Min" min="0"
              value={filters.minPrice || ''}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-zinc-400 bg-zinc-50"
            />
            <input
              type="number" placeholder="Max" min="0"
              value={filters.maxPrice || ''}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-zinc-400 bg-zinc-50"
            />
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Availability</p>
        <div className="space-y-1">
          {[['', 'All'], ['inStock', 'In Stock'], ['outOfStock', 'Out of Stock']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2.5 text-sm cursor-pointer py-1 group">
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${filters.availability === val ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300 group-hover:border-zinc-400'}`}>
                {filters.availability === val && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </span>
              <input type="radio" name="availability" value={val} checked={filters.availability === val} onChange={() => onChange({ availability: val })} className="sr-only" />
              <span className={filters.availability === val ? 'text-zinc-900 font-medium' : 'text-zinc-600'}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onChange({ category: '', minPrice: '', maxPrice: '', availability: '' })}
        className="w-full text-xs font-semibold text-zinc-500 hover:text-zinc-900 py-2 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
