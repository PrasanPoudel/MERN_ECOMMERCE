import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

const Req = () => <span className="text-red-500 ml-0.5">*</span>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(login(form));
    if (res.meta.requestStatus === "fulfilled") {
      if (res.payload.user.role === "customer") dispatch(fetchCart());
      toast.success(`Welcome back, ${res.payload.user.name}!`);
      navigate(res.payload.user.role === "admin" ? "/admin" : "/");
    } else {
      toast.error(res.payload || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Zentro</h1>
          <p className="text-zinc-500 mt-1.5 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email <Req /></label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-zinc-50 focus:bg-white transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password <Req /></label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-zinc-50 focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-2.5 rounded-xl font-semibold hover:bg-zinc-700 disabled:opacity-50 transition-colors text-sm mt-1"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          Don't have an account?{" "}
          <Link to="/signup" className="text-zinc-900 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
