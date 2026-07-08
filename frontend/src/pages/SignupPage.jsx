import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Req = () => <span className="text-red-500 ml-0.5">*</span>;

const FIELDS = [
  { key: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
  },
  {
    key: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    key: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
  },
];

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password?.lengthhh < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const res = await dispatch(signup({ name, email, password }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Account created!");
      navigate("/");
    } else {
      toast.error(res.payload || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Zentro
          </h1>
          <p className="text-zinc-500 mt-1.5 text-sm">Create your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map(({ key, label, type, placeholder }) => {
              const inputType =
                key === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : key === "confirmPassword"
                    ? showConfirmPassword
                      ? "text"
                      : "password"
                    : type;

              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    {label} <Req />
                  </label>
                  {key === "password" || key === "confirmPassword" ? (
                    <div className="relative">
                      <input
                        type={inputType}
                        value={form[key]}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, [key]: e.target.value }))
                        }
                        className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 pr-11 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-zinc-50 focus:bg-white transition-all"
                        placeholder={placeholder}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          key === "password"
                            ? setShowPassword((p) => !p)
                            : setShowConfirmPassword((p) => !p)
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-700"
                        aria-label={
                          key === "password"
                            ? showPassword
                              ? "Hide password"
                              : "Show password"
                            : showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                        }
                      >
                        {key === "password" ? (
                          showPassword ? (
                            <FiEyeOff size={18} />
                          ) : (
                            <FiEye size={18} />
                          )
                        ) : showConfirmPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={inputType}
                      value={form[key]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-zinc-50 focus:bg-white transition-all"
                      placeholder={placeholder}
                      required
                    />
                  )}
                </div>
              );
            })}

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
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-zinc-900 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
