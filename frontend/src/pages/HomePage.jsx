import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import ProductCard from "../components/product/ProductCard";
import SkeletonCard from "../components/common/SkeletonCard";
import {
  RiArrowRightLine,
  RiShieldCheckLine,
  RiTruckLine,
  RiRefundLine,
} from "react-icons/ri";

const FEATURES = [
  { icon: RiTruckLine, title: "Free Shipping", desc: "On all orders over $50" },
  {
    icon: RiShieldCheckLine,
    title: "Secure Payment",
    desc: "100% protected transactions",
  },
  {
    icon: RiRefundLine,
    title: "Easy Returns",
    desc: "30-day hassle-free returns",
  },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((s) => s.products);
  const { items: categories } = useSelector((s) => s.categories);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sort: "newest" }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="bg-zinc-50">
      {/* Hero */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 leading-tight tracking-tight mb-5">
              Shop what you
              <br />
              actually love.
            </h1>
            <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
              Thousands of curated products. Unbeatable prices. Delivered fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-zinc-700 transition-colors text-sm"
              >
                Browse products <RiArrowRightLine size={16} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-zinc-600 font-medium px-6 py-3 rounded-2xl hover:bg-zinc-100 transition-colors text-sm border border-zinc-200"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-xl font-bold text-zinc-900">
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="text-sm text-white p-2 rounded-2xl hover:bg-zinc-700 bg-zinc-900 flex items-center gap-1 transition-colors"
            >
              View All <RiArrowRightLine size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-zinc-100 overflow-hidden flex items-center justify-center">
                  {cat.image?.url ? (
                    <img
                      src={cat.image.url}
                      alt={cat.name}
                      className="w-[90%] h-[90%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-zinc-300">
                        {cat.name[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-zinc-700 truncate">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* New Arrivals */}
      {products?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-xl font-bold text-zinc-900">New Arrivals</h2>
            <Link
              to="/products"
              className="text-sm text-white p-2 rounded-2xl bg-zinc-900 hover:bg-zinc-700 flex items-center gap-1 transition-colors"
            >
              View all <RiArrowRightLine size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array(8)
                  .fill(0)
                  .map((_, i) => <SkeletonCard key={i} />)
              : products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
