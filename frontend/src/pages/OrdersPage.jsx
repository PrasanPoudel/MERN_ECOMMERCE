import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../store/slices/ordersSlice";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import Spinner from "../components/common/Spinner";
import Pagination from "../components/common/Pagination";
import { RiArrowRightSLine, RiShoppingBag3Line } from "react-icons/ri";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  "To Ship": "bg-blue-50 text-blue-700 border-blue-100",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Out for Delivery": "bg-purple-50 text-purple-700 border-purple-100",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { items: orders, loading, pages, page } = useSelector((s) => s.orders);
  const load = (p = 1) => dispatch(fetchOrders({ page: p, limit: 10 }));

  useEffect(() => {
    load();
  }, [dispatch]);

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "My Orders" }]}
      />
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">My Orders</h1>

      {orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mb-5">
            <RiShoppingBag3Line size={36} className="text-zinc-400" />
          </div>
          <p className="text-lg font-semibold text-zinc-700">No orders yet</p>
          <p className="text-sm text-zinc-400 mt-1 mb-6">
            Your order history will appear here
          </p>
          <Link
            to="/products"
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order?._id}
              to={`/orders/${order?._id}`}
              className="block bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Order
                  </p>
                  <p className="font-mono text-sm font-bold text-zinc-800 mt-0.5">
                    #{order?._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-xl border ${STATUS_STYLES[order.orderStatus] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex gap-2 mb-4">
                {order.items?.slice(0, 4).map((item, i) => (
                  <img
                    key={i}
                    src={item.image || "https://placehold.co/60x60"}
                    alt={item.name}
                    className="w-11 h-11 object-contain mix-blend-multiply rounded-xl shrink-0"
                  />
                ))}
                {order?.items?.length > 4 && (
                  <div className="w-11 h-11 bg-zinc-100 rounded-xl flex items-center justify-center text-xs font-semibold text-zinc-500 shrink-0">
                    +{order.items?.length - 4}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-zinc-900 text-sm">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                  <RiArrowRightSLine size={16} className="text-zinc-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Pagination page={page} pages={pages} onPageChange={load} />
    </div>
  );
}
