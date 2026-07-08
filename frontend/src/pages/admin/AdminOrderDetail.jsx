import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder, updateOrderStatus } from "../../store/slices/ordersSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { RiArrowLeftLine, RiCheckLine } from "react-icons/ri";

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

export default function AdminOrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [id, dispatch]);

  const handleStatusChange = async (status) => {
    const res = await dispatch(updateOrderStatus({ id, status }));
    if (res.meta.requestStatus === "fulfilled") toast.success("Status updated");
    else toast.error(res.payload || "Failed");
  };

  if (loading || !order)
    return (
      <AdminLayout>
        <Spinner size="lg" />
      </AdminLayout>
    );

  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/orders"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <RiArrowLeftLine size={16} /> Orders
        </Link>
        <span className="text-zinc-200">/</span>
        <h1 className="text-base font-bold text-zinc-900">
          #{order?._id?.slice(-8).toUpperCase()}
        </h1>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-xl border ml-1 ${STATUS_STYLES[order.orderStatus] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}
        >
          {order.orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-bold text-zinc-900 mb-4">Items</h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <img
                    src={item.image || "https://placehold.co/60x60"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xl bg-zinc-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Qty {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-zinc-900 text-sm shrink-0">
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

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-bold text-zinc-900 mb-6">
              Order Timeline
            </h2>
            <div className="relative pl-4">
              <div className="absolute left-4 top-3 bottom-3 w-px bg-zinc-100" />
              <div
                className="absolute left-4 top-3 w-px bg-zinc-900 transition-all"
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
                    <div
                      key={step}
                      className="flex items-start gap-4 relative p-2"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-colors ${done ? "bg-zinc-900 border-zinc-900 text-white" : "bg-white border-zinc-200 text-zinc-400"}`}
                      >
                        {done ? (
                          <RiCheckLine size={13} />
                        ) : (
                          <span className="text-xs font-bold">{i + 1}</span>
                        )}
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
        </div>

        <div className="space-y-4">
          {/* Update Status */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h2 className="text-sm font-bold text-zinc-900 mb-3">
              Update Status
            </h2>
            <div className="space-y-1.5">
              {ORDER_STEPS?.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    order.orderStatus === s
                      ? `${STATUS_STYLES[s]} border`
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {s}
                  {order.orderStatus === s && <RiCheckLine size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h2 className="text-sm font-bold text-zinc-900 mb-3">Customer</h2>
            <p className="font-semibold text-zinc-900 text-sm">
              {order.user?.name}
            </p>
            <p className="text-sm text-zinc-400 mt-0.5">{order.user?.email}</p>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h2 className="text-sm font-bold text-zinc-900 mb-3">Shipping</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Province No: {order.shippingAddress.province}
              <br />
              District: {order.shippingAddress.district}
              <br />
              Municipality: {order.shippingAddress.municipality}
              <br />
              Ward No: {order.shippingAddress.wardNo}
              <br />
              Town: {order.shippingAddress.town}
              <br />
              {order.shippingAddress?.landmark &&
                `Landmark: ${order.shippingAddress.landmark}`}
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <h2 className="text-sm font-bold text-zinc-900 mb-3">Payment</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-400">Method</span>
              <span className="font-semibold text-zinc-800">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Status</span>
              <span
                className={`font-semibold ${order.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
