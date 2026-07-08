import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../store/slices/ordersSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";

const STATUS_OPTIONS = [
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

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { items: orders, loading, pages, page } = useSelector((s) => s.orders);
  const [filterStatus, setFilterStatus] = useState("");

  const load = (p = 1) => {
    const params = { page: p, limit: 10 };
    if (filterStatus) params.status = filterStatus;
    dispatch(fetchOrders(params));
  };

  useEffect(() => {
    load();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, status) => {
    const res = await dispatch(updateOrderStatus({ id: orderId, status }));
    if (res.meta.requestStatus === "fulfilled") toast.success("Status updated");
    else toast.error(res.payload || "Failed");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-start justify-between sm:flex-row space-y-2 sm:items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Orders</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage customer orders</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-zinc-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none text-zinc-700"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS?.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {[
                      "Order",
                      "Customer",
                      "Items",
                      "Total",
                      "Payment",
                      "Status",
                      "Date",
                      "",
                    ]?.map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {orders?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-12 text-zinc-400 text-sm"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders?.map((order) => (
                      <tr
                        key={order?._id}
                        className="hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-5 py-4 font-mono text-xs font-bold text-zinc-700">
                          #{order?._id?.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-zinc-900">
                            {order.user?.name}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {order.user?.email}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-zinc-500">
                          {order.items?.length}
                        </td>
                        <td className="px-5 py-4 font-bold text-zinc-900">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-xl border ${order.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(order?._id, e.target.value)
                            }
                            className={`text-xs font-semibold px-2.5 py-1 rounded-xl border outline-none cursor-pointer ${STATUS_STYLES[order.orderStatus]}`}
                          >
                            {STATUS_OPTIONS?.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4 text-zinc-400 text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            to={`/admin/orders/${order?._id}`}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors inline-flex"
                          >
                            <RiArrowRightSLine size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} pages={pages} onPageChange={load} />
        </>
      )}
    </AdminLayout>
  );
}
