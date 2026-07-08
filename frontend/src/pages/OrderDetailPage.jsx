import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../store/slices/ordersSlice";
import Breadcrumb from "../components/common/Breadcrumb";
import Spinner from "../components/common/Spinner";
import { RiCheckLine } from "react-icons/ri";

const ORDER_STEPS = [
  "Pending",
  "To Ship",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  "To Ship": "bg-blue-50 text-blue-700 border-blue-100",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Out for Delivery": "bg-purple-50 text-purple-700 border-purple-100",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [id, dispatch]);

  if (loading || !order) return <Spinner size="lg" />;

  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: `#${order?._id?.slice(-8).toUpperCase()}` },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Order Details</h1>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${STATUS_STYLES[order.orderStatus] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* Tracking */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-5">
        <h2 className="text-sm font-bold text-zinc-900 mb-6">Order Tracking</h2>
        <div className="relative pl-4">
          <div className="absolute left-4 top-3 bottom-3 w-px bg-zinc-100" />
          <div
            className="absolute left-4 top-3 w-px bg-zinc-900 transition-all duration-500"
            style={{
              height: `${(currentStepIndex / (ORDER_STEPS?.length - 1)) * 100}%`,
            }}
          />
          <div className="space-y-5">
            {ORDER_STEPS?.map((step, i) => {
              const done = i <= currentStepIndex;
              const histEntry = order.statusHistory?.find(
                (h) => h.status === step,
              );
              return (
                <div key={step} className="flex items-start gap-4 relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold border-2 transition-colors ${
                      done
                        ? "bg-zinc-900 border-zinc-900 text-white"
                        : "bg-white border-zinc-200 text-zinc-400"
                    }`}
                  >
                    {done ? <RiCheckLine size={13} /> : i + 1}
                  </div>
                  <div className="pt-0.5">
                    <p
                      className={`text-sm font-semibold ${done ? "text-zinc-900" : "text-zinc-400"}`}
                    >
                      {step}
                    </p>
                    {histEntry && (
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {new Date(histEntry.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="text-sm font-bold text-zinc-900 mb-4">
            Items Ordered
          </h2>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <img
                  src={item.image || "https://placehold.co/60x60"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-xl shrink-0 bg-zinc-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Qty {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-bold text-zinc-900 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-100 mt-4 pt-4 flex justify-between font-bold text-zinc-900 text-sm">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h2 className="text-sm font-bold text-zinc-900 mb-3">
              Shipping Address
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {order.shippingAddress.municipality}, Ward{" "}
              {order.shippingAddress.wardNo}
              <br />
              {order.shippingAddress.town}
              <br />
              {order.shippingAddress.district}, Province{" "}
              {order.shippingAddress.province}
              {order.shippingAddress.landmark && (
                <>
                  <br />
                  <span className="text-zinc-400">
                    Near: {order.shippingAddress.landmark}
                  </span>
                </>
              )}
            </p>
          </div>
          {/* Payment */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h2 className="text-sm font-bold text-zinc-900 mb-3">Payment</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Method</span>
                <span className="font-semibold text-zinc-800">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status</span>
                <span
                  className={`font-semibold ${order.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
