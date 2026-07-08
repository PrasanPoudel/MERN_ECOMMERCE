import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../../store/slices/productsSlice";
import { fetchCategories } from "../../store/slices/categoriesSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiCloseLine,
  RiImageAddLine,
} from "react-icons/ri";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
};

const STATUS_STYLES = {
  "In Stock": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Low Stock": "bg-amber-50 text-amber-700 border-amber-100",
  "Out of Stock": "bg-red-50 text-red-600 border-red-100",
};

const INPUT_CLS =
  "w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-zinc-50 focus:bg-white transition-all";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { items, loading, pages, page } = useSelector((s) => s.products);
  const { items: categories } = useSelector((s) => s.categories);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const load = (p = 1) => {
    const params = { page: p, limit: 10 };
    if (search) params.search = search;
    if (filterCat) params.category = filterCat;
    dispatch(fetchProducts(params));
  };

  useEffect(() => {
    load();
  }, [search, filterCat]);

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setFiles([]);
    setPreviews([]);
    setRemoveImages([]);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category?._id || "",
    });
    setFiles([]);
    setPreviews([]);
    setRemoveImages([]);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("images", f));
    if (removeImages.length)
      fd.append("removeImages", JSON.stringify(removeImages));
    const res = editProduct
      ? await dispatch(updateProduct({ id: editProduct._id, formData: fd }))
      : await dispatch(createProduct(fd));
    setSaving(false);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(editProduct ? "Product updated" : "Product created");
      setShowModal(false);
      load();
    } else toast.error(res.payload || res.error?.message || "Failed");
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteProduct(id));
    if (res.meta.requestStatus === "fulfilled")
      toast.success("Product deleted");
    else toast.error(res.payload || res.error?.message || "Failed");
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Products</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage your product catalog
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl hover:bg-zinc-700 text-sm font-semibold transition-colors"
        >
          <RiAddLine size={16} /> Add Product
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex items-center border border-zinc-200 rounded-xl bg-white flex-1 min-w-[200px] px-3 gap-2">
          <RiSearchLine size={15} className="text-zinc-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="flex-1 py-2.5 text-sm outline-none bg-transparent"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="border border-zinc-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none text-zinc-700"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
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
                      "Product",
                      "Category",
                      "Price",
                      "Stock",
                      "Status",
                      "",
                    ].map((h) => (
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
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-zinc-400 text-sm"
                      >
                        No products found
                      </td>
                    </tr>
                  ) : (
                    items.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                p.images?.[0]?.url ||
                                "https://placehold.co/40x40"
                              }
                              alt=""
                              className="w-10 h-10 object-cover rounded-xl bg-zinc-100 shrink-0"
                            />
                            <span className="font-medium text-zinc-900 max-w-[180px] truncate">
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-zinc-500">
                          {p.category?.name || "—"}
                        </td>
                        <td className="px-5 py-4 font-semibold text-zinc-900">
                          ${p.price.toFixed(2)}
                        </td>
                        <td className="px-5 py-4 text-zinc-600">
                          {p.quantity}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-xl border ${STATUS_STYLES[p.status]}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                            >
                              <RiEditLine size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(p._id)}
                              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <RiDeleteBinLine size={16} />
                            </button>
                          </div>
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

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <h2 className="text-base font-bold text-zinc-900">
                {editProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 transition-colors"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className={INPUT_CLS}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    className={INPUT_CLS}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, quantity: e.target.value }))
                    }
                    className={INPUT_CLS}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className={INPUT_CLS}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    rows={10}
                    className={`${INPUT_CLS} resize-none`}
                    required
                  />
                </div>
              </div>

              {editProduct?.images?.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-2">
                    Current Images
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {editProduct.images.map((img) => (
                      <div key={img.public_id} className="relative">
                        <img
                          src={img.url}
                          alt=""
                          className={`w-16 h-16 object-cover rounded-xl ${removeImages.includes(img.public_id) ? "opacity-30" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setRemoveImages((p) =>
                              p.includes(img.public_id)
                                ? p.filter((x) => x !== img.public_id)
                                : [...p, img.public_id],
                            )
                          }
                          className="absolute -top-1.5 -right-1.5 bg-zinc-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                        >
                          {removeImages.includes(img.public_id) ? "+" : "×"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                  {editProduct ? (
                    "Add More Images"
                  ) : (
                    <span>
                      Product Images <span className="text-red-500">*</span>
                    </span>
                  )}
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-xl px-4 py-4 text-sm text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 w-full transition-colors"
                >
                  <RiImageAddLine size={18} /> Click to upload images (max 5)
                </button>
                {previews.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {previews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-zinc-200 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                >
                  {saving
                    ? "Saving…"
                    : editProduct
                      ? "Update Product"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 mb-1">
              Delete Product?
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              This action cannot be undone.
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
