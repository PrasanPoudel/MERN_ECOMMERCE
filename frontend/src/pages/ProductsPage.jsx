import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import SkeletonCard from '../components/common/SkeletonCard';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';
import { RiEqualizerLine, RiCloseLine } from 'react-icons/ri';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceLow', label: 'Price: Low → High' },
  { value: 'priceHigh', label: 'Price: High → Low' },
  { value: 'bestSelling', label: 'Best Selling' },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items, loading, total, pages, page } = useSelector((s) => s.products);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '', availability: '', sort: 'newest',
  });

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    setFilters((prev) => ({ ...prev, search, category }));
  }, [searchParams]);

  const loadProducts = useCallback((f, p = 1) => {
    const params = { page: p, limit: 12 };
    if (f.search) params.search = f.search;
    if (f.category) params.category = f.category;
    if (f.minPrice) params.minPrice = f.minPrice;
    if (f.maxPrice) params.maxPrice = f.maxPrice;
    if (f.availability) params.availability = f.availability;
    if (f.sort) params.sort = f.sort;
    dispatch(fetchProducts(params));
  }, [dispatch]);

  useEffect(() => { loadProducts(filters); }, [filters, loadProducts]);

  const handleFilterChange = (updates) => setFilters((prev) => ({ ...prev, ...updates }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">All Products</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{total} products</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange({ sort: e.target.value })}
            className="border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none bg-white text-zinc-700 hover:border-zinc-300 transition-colors"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            {showFilters ? <RiCloseLine size={16} /> : <RiEqualizerLine size={16} />}
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}>
          <ProductFilters filters={filters} onChange={handleFilterChange} />
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                <RiEqualizerLine size={28} className="text-zinc-400" />
              </div>
              <p className="text-base font-semibold text-zinc-700">No products found</p>
              <p className="text-sm text-zinc-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <Pagination page={page} pages={pages} onPageChange={(p) => loadProducts(filters, p)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
