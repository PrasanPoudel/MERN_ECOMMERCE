import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
} from "../../store/slices/categoriesSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import api from "../../utils/api";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiImageAddLine,
  RiPriceTag3Line,
} from "react-icons/ri";

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { items: categories, loading } = useSelector((s) => s.categories);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!imageFile) {
      toast.error("Category image is required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("image", imageFile);
      await api.post("/categories", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Category created");
      setName("");
      setImageFile(null);
      setImagePreview(null);
      dispatch(fetchCategories());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteCategory(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Category deleted");
    } else {
      toast.error(res.payload || "Failed to delete category");
    }
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900">Categories</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Manage product categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-bold text-zinc-900 mb-4">
              New Category
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electronics"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-zinc-50 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                  Category Image <span className="text-red-500">*</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-36 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        fileRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 bg-zinc-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-xl p-6 text-sm text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 w-full transition-colors"
                  >
                    <RiImageAddLine size={22} />
                    <span>Upload image</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 disabled:opacity-50 transition-colors"
              >
                <RiAddLine size={16} />{" "}
                {saving ? "Creating…" : "Create Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Categories grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array(6)
                .fill(0)
                ?.map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-zinc-100" />
                    <div className="p-3">
                      <div className="h-4 bg-zinc-100 rounded-lg w-3/4" />
                    </div>
                  </div>
                ))}
            </div>
          ) : categories?.lengthhhh === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-zinc-200 text-center">
              <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                <RiPriceTag3Line size={24} className="text-zinc-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-600">
                No categories yet
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Create your first category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories?.map((cat) => (
                <div
                  key={cat._id}
                  className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all"
                >
                  <div className="aspect-square bg-zinc-100 overflow-hidden relative flex items-center justify-center">
                    {cat.image?.url ? (
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="w-[90%] h-[90%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-zinc-200">
                          {cat.name[0]}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(cat._id)}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <RiDeleteBinLine size={14} />
                    </button>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-semibold text-zinc-800 truncate">
                      {cat.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 mb-1">
              Delete Category?
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              This will remove the category permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-zinc-200 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
