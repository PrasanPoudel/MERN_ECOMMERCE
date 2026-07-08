import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateProfile,
  addAddress,
  deleteAddress,
  deleteAccount,
  logout,
} from "../store/slices/authSlice";
import Breadcrumb from "../components/common/Breadcrumb";
import toast from "react-hot-toast";
import {
  RiUserLine,
  RiMapPinLine,
  RiAddLine,
  RiDeleteBinLine,
} from "react-icons/ri";

const INPUT_CLS =
  "w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-zinc-50 focus:bg-white transition-all";

const Req = () => <span className="text-red-500 ml-0.5">*</span>;
const Opt = () => (
  <span className="text-zinc-400 font-normal ml-1">(optional)</span>
);

const EMPTY_ADDR = {
  label: "",
  province: "",
  district: "",
  municipality: "",
  wardNo: "",
  town: "",
  landmark: "",
  isDefault: false,
};

const ADDR_FIELDS = [
  {
    key: "label",
    label: "Label",
    required: true,
    full: true,
    placeholder: "e.g. Home",
  },
  {
    key: "province",
    label: "Province No.",
    required: true,
    full: false,
    placeholder: "",
  },
  {
    key: "district",
    label: "District",
    required: true,
    full: false,
    placeholder: "",
  },
  {
    key: "municipality",
    label: "Municipality",
    required: true,
    full: false,
    placeholder: "",
  },
  {
    key: "wardNo",
    label: "Ward No.",
    required: true,
    full: false,
    placeholder: "",
  },
  { key: "town", label: "Town", required: true, full: true, placeholder: "" },
  {
    key: "landmark",
    label: "Landmark",
    required: false,
    full: true,
    placeholder: "Near landmark, building name…",
  },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState(EMPTY_ADDR);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const data = {};
    if (name !== user.name) data.name = name;
    if (password) data.password = password;
    if (!Object.keys(data)?.length) return;
    const res = await dispatch(updateProfile(data));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Profile updated");
      setPassword("");
    } else toast.error(res.payload || "Update failed");
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const res = await dispatch(addAddress(newAddr));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Address added");
      setShowAddAddr(false);
      setNewAddr(EMPTY_ADDR);
    } else toast.error(res.payload || "Failed");
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!user) return;

    setDeletingAccount(true);
    const res = await dispatch(
      deleteAccount({ email: deleteConfirmEmail.trim() }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Account deleted");
      dispatch(logout());
      navigate("/login");
    } else {
      toast.error(res.payload || "Failed to delete account");
    }
    setDeletingAccount(false);
  };

  const TABS = [
    { key: "profile", label: "Profile", icon: RiUserLine },
    { key: "addresses", label: "Addresses", icon: RiMapPinLine },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "My Account" }]}
      />
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">My Account</h1>

      <div className="flex gap-1 mb-6 bg-zinc-100 p-1 rounded-xl w-fit">
        {TABS?.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === key
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form
          onSubmit={handleProfileSave}
          className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Full Name <Req />
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLS}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
              Email
            </label>
            <input
              value={user?.email}
              disabled
              className="w-full border border-zinc-100 rounded-xl px-4 py-2.5 text-sm bg-zinc-50 text-zinc-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
              New Password <Opt />
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className={INPUT_CLS}
            />
          </div>

          {user?.role !== "admin" && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-md font-semibold text-red-600">
                    Delete account
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    This will permanently remove your account and related data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-400 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl hover:bg-zinc-700 text-sm font-semibold transition-colors"
          >
            Save Changes
          </button>
        </form>
      )}

      {tab === "addresses" && (
        <div className="space-y-3">
          {user?.addresses?.map((addr) => (
            <div
              key={addr._id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-zinc-900 text-sm">
                    {addr.label}
                  </p>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed w-full">
                  {addr.municipality}, Ward {addr.wardNo}, {addr.town}
                  <br />
                  {addr.district}, Province {addr.province}
                  {addr.landmark && (
                    <>
                      <br />
                      <span className="text-zinc-400">
                        Near: {addr.landmark}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  dispatch(deleteAddress(addr._id));
                  toast.success("Address removed");
                }}
                className="text-zinc-300 hover:text-red-500 transition-colors ml-4 shrink-0"
              >
                <RiDeleteBinLine size={17} />
              </button>
            </div>
          ))}

          {!showAddAddr ? (
            <button
              onClick={() => setShowAddAddr(true)}
              className="flex items-center gap-2 w-full border-2 border-dashed border-zinc-200 rounded-2xl p-4 text-sm font-medium text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <RiAddLine size={18} /> Add New Address
            </button>
          ) : (
            <form
              onSubmit={handleAddAddress}
              className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4"
            >
              <h3 className="font-bold text-zinc-900 text-sm">New Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDR_FIELDS?.map(
                  ({ key, label, required, full, placeholder }) => (
                    <div key={key} className={full ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                        {label}
                        {required ? <Req /> : <Opt />}
                      </label>
                      <input
                        value={newAddr[key]}
                        onChange={(e) =>
                          setNewAddr((p) => ({ ...p, [key]: e.target.value }))
                        }
                        placeholder={placeholder}
                        className={INPUT_CLS}
                        required={required}
                      />
                    </div>
                  ),
                )}
              </div>
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddr.isDefault}
                  onChange={(e) =>
                    setNewAddr((p) => ({ ...p, isDefault: e.target.checked }))
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-zinc-600 font-medium">
                  Set as default
                </span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAddr(false)}
                  className="flex-1 border border-zinc-200 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900">Delete account?</h3>
            <p className="mt-2 text-sm text-zinc-500">
              This action is permanent. Type your email below to confirm.
            </p>
            <form onSubmit={handleDeleteAccount} className="mt-4 space-y-4">
              <input
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                placeholder={user?.email || "your@email.com"}
                className={INPUT_CLS}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmEmail("");
                  }}
                  className="flex-1 border border-zinc-200 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    deletingAccount ||
                    deleteConfirmEmail.trim().toLowerCase() !==
                      (user?.email || "").toLowerCase()
                  }
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deletingAccount ? "Deleting…" : "Delete Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
