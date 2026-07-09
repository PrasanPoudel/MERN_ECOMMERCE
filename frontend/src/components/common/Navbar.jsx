import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "../../store/slices/authSlice";
import {
  RiShoppingBagLine,
  RiUserLine,
  RiMenuLine,
  RiCloseLine,
  RiLogoutBoxLine,
  RiDashboardLine,
  RiShoppingCartLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiHome4Line,
} from "react-icons/ri";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link
          to="/"
          className="text-xl font-bold text-zinc-900 tracking-tight shrink-0"
        >
          Zentro
        </Link>

        <div className="hidden md:flex items-center gap-1 ml-auto">
          {user ? (
            <>
              {user.role === "admin" ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive ? "text-zinc-900 font-semibold underline" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`
                  }
                >
                  <RiDashboardLine size={16} /> Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive ? "text-zinc-900 font-semibold underline" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`
                    }
                  >
                    <RiHome4Line size={16} /> Home
                  </NavLink>

                  <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive ? "text-zinc-900 font-semibold underline" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`
                    }
                  >
                    <RiShoppingBagLine size={16} /> Orders
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `relative flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${isActive ? "text-zinc-900 font-semibold underline" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}`
                    }
                  >
                    <RiShoppingCartLine size={16} />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-zinc-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                        {cartCount}
                      </span>
                    )}
                    Cart
                  </NavLink>
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg font-medium"
                    >
                      <RiUserLine size={16} /> {user.name}
                      {userMenuOpen ? (
                        <RiArrowUpSLine size={16} />
                      ) : (
                        <RiArrowDownSLine size={16} />
                      )}
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-6 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50">
                        <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                          <p className="text-sm font-semibold text-zinc-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg"
                        >
                          <RiUserLine size={16} /> Update Profile
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <RiLogoutBoxLine size={16} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-zinc-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-zinc-800 font-medium ml-1"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-zinc-100 text-zinc-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 px-4 py-4 flex flex-col gap-1">
          {user ? (
            <>
              {user.role === "admin" ? (
                <NavLink
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive ? "text-zinc-900 font-semibold underline" : "text-zinc-700 hover:bg-zinc-100"}`
                  }
                >
                  <RiDashboardLine size={16} /> Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive ? "text-zinc-900 font-semibold underline" : "text-zinc-700 hover:bg-zinc-100"}`
                    }
                  >
                    <RiHome4Line size={16} /> Home
                  </NavLink>
                  <NavLink
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive ? "text-zinc-900 font-semibold underline" : "text-zinc-700 hover:bg-zinc-100"}`
                    }
                  >
                    <RiShoppingBagLine size={16} /> Orders
                  </NavLink>
                  <NavLink
                    to="/cart"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors ${isActive ? "text-zinc-900 font-semibold underline" : "text-zinc-700 hover:bg-zinc-100"}`
                    }
                  >
                    <RiShoppingCartLine size={16} /> Cart{" "}
                    {cartCount > 0 && `(${cartCount})`}
                  </NavLink>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2 space-y-1">
                    <div className="px-2 py-1">
                      <p className="text-sm font-semibold text-zinc-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-zinc-700 hover:bg-white rounded-lg"
                    >
                      <RiUserLine size={16} /> Update Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-white rounded-lg text-left"
                    >
                      <RiLogoutBoxLine size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 rounded-lg"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900">Log out?</h3>
            <p className="mt-2 text-sm text-zinc-500">
              You’ll need to sign in again to continue.
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
    </nav>
  );
}
