import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/slices/adminSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import Spinner from "../../components/common/Spinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  RiBox3Line,
  RiGroupLine,
  RiShoppingBagLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiTruckLine,
  RiSendPlaneLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiCloseCircleLine,
} from "react-icons/ri";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-zinc-900 mt-1.5">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-zinc-700 mb-1">{label}</p>
      {payload?.map((p) => (
        <p key={p.dataKey} className="text-zinc-900 font-bold">
          {prefix}
          {typeof p.value === "number" && prefix === "$"
            ? p.value.toFixed(2)
            : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading || !stats)
    return (
      <AdminLayout>
        <Spinner size="lg" />
      </AdminLayout>
    );

  const chartData = stats.monthlyRevenue?.map((d) => ({
    month: MONTHS[d._id.month - 1],
    revenue: d.revenue,
    orders: d.orders,
  }));

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Overview of your store</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Products"
          value={stats.totalProducts}
          icon={RiBox3Line}
          accent="bg-zinc-100 text-zinc-600"
        />
        <StatCard
          label="Customers"
          value={stats.totalCustomers}
          icon={RiGroupLine}
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Orders"
          value={stats.totalOrders}
          icon={RiShoppingBagLine}
          accent="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={RiMoneyDollarCircleLine}
          accent="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Pending"
          value={stats.pendingOrders}
          icon={RiTimeLine}
          accent="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="To Ship"
          value={stats.toShipOrders}
          icon={RiSendPlaneLine}
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Shipped"
          value={stats.shippedOrders}
          icon={RiTruckLine}
          accent="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Delivered"
          value={stats.deliveredOrders}
          icon={RiCheckboxCircleLine}
          accent="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Out of Stock"
          value={stats.outOfStockProducts}
          icon={RiCloseCircleLine}
          accent="bg-red-50 text-red-500"
        />
        <StatCard
          label="Low Stock"
          value={stats.lowStockProducts}
          icon={RiErrorWarningLine}
          accent="bg-orange-50 text-orange-500"
        />
      </div>

      {chartData?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-bold text-zinc-900 mb-5">
              Monthly Revenue
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={20}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f4f4f5"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip prefix="$" />}
                  cursor={{ fill: "#f4f4f5" }}
                />
                <Bar dataKey="revenue" fill="#18181b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-bold text-zinc-900 mb-5">
              Monthly Orders
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f4f4f5"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#18181b"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#18181b", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
