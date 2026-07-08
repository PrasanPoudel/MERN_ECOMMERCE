import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  RiDashboardLine,
  RiBox3Line,
  RiShoppingBagLine,
  RiGroupLine,
  RiPriceTag3Line,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
} from "react-icons/ri";
import { useState } from "react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: RiDashboardLine },
  { to: "/admin/products", label: "Products", icon: RiBox3Line },
  { to: "/admin/orders", label: "Orders", icon: RiShoppingBagLine },
  { to: "/admin/customers", label: "Customers", icon: RiGroupLine },
  { to: "/admin/categories", label: "Categories", icon: RiPriceTag3Line },
];

function SidebarContent({ location, onNav, onLogout }) {
  return (
    <aside className="w-60 bg-zinc-950 text-white flex flex-col h-full">
      <div className="px-6 h-16 flex items-center border-b border-zinc-800">
        <span className="text-base font-bold tracking-tight text-white">
          Zentro
        </span>
        <span className="ml-2 text-[10px] font-semibold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
          Admin
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV?.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-white text-zinc-900"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-zinc-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 w-full"
        >
          <RiLogoutBoxLine size={17} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <div className="hidden md:flex flex-col w-60 shrink-0">
        <SidebarContent
          location={location}
          onNav={() => {}}
          onLogout={() => setShowLogoutConfirm(true)}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-60 flex flex-col">
            <SidebarContent
              location={location}
              onNav={() => setSidebarOpen(false)}
              onLogout={() => setShowLogoutConfirm(true)}
            />
          </div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600"
          >
            <RiMenuLine size={20} />
          </button>
          <span className="font-semibold text-zinc-900 text-sm">
            Admin Panel
          </span>
        </div>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900">Log out?</h3>
            <p className="mt-2 text-sm text-zinc-500">
              You’ll be signed out of the admin panel.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 border border-zinc-200 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-400 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
