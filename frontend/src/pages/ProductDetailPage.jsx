import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import Breadcrumb from "../components/common/Breadcrumb";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";
import { RiShoppingCartLine, RiSubtractLine, RiAddLine } from "react-icons/ri";

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: product, loading } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    if (user.role === "admin") {
      toast.error("Admins cannot shop");
      return;
    }
    const res = await dispatch(
      addToCart({ productId: product._id, quantity: qty }),
    );
    if (res.meta.requestStatus === "fulfilled") toast.success("Added to cart!");
    else toast.error(res.payload || "Failed");
  };

  if (loading) return <Spinner size="lg" />;
  if (!product)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
        <p className="text-lg font-medium">Product not found</p>
      </div>
    );

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          <div className="bg-zinc-100 rounded-2xl overflow-hidden aspect-square mb-3">
            <img
              src={
                product.images?.[activeImg]?.url ||
                "https://placehold.co/500x500?text=No+Image"
              }
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-colors ${i === activeImg ? "border-zinc-900" : "border-transparent hover:border-zinc-300"}`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.category?.name && (
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight mb-3">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-zinc-900 mb-4">
            ${product.price.toFixed(2)}
          </p>

          <div className="mb-5">
            {isOutOfStock ? (
              <span className="inline-flex items-center text-xs font-semibold bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-xl">
                Out of Stock
              </span>
            ) : product.status === "Low Stock" ? (
              <span className="inline-flex items-center text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-xl">
                Low Stock — {product.quantity} left
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-xl">
                In Stock ({product.quantity})
              </span>
            )}
          </div>

          <p className="text-zinc-500 text-sm text-justify leading-relaxed mb-6 flex-1">
            {product.description}
          </p>

          {!isOutOfStock && (
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-medium text-zinc-600">Qty</span>
              <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2.5 hover:bg-zinc-100 text-zinc-600 transition-colors"
                >
                  <RiSubtractLine size={14} />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-zinc-900 min-w-10 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.quantity, qty + 1))}
                  className="px-3 py-2.5 hover:bg-zinc-100 text-zinc-600 transition-colors"
                >
                  <RiAddLine size={14} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3.5 rounded-2xl font-semibold hover:bg-zinc-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <RiShoppingCartLine size={18} />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
