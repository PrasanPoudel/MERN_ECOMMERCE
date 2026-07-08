import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, removeCartItem } from "../store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";
import {
  RiDeleteBinLine,
  RiSubtractLine,
  RiAddLine,
  RiShoppingBag3Line,
} from "react-icons/ri";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.cart);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleQtyChange = async (itemId, qty) => {
    if (qty < 1) return;
    const res = await dispatch(updateCartItem({ itemId, quantity: qty }));
    if (res.meta.requestStatus === "rejected")
      toast.error(res.payload || "Failed to update");
  };

  const handleRemove = async (itemId) => {
    await dispatch(removeCartItem(itemId));
    toast.success("Item removed");
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Shopping Cart</h1>

      {items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mb-5">
            <RiShoppingBag3Line size={36} className="text-zinc-400" />
          </div>
          <p className="text-lg font-semibold text-zinc-700">
            Your cart is empty
          </p>
          <p className="text-sm text-zinc-400 mt-1 mb-6">
            Add some products to get started
          </p>
          <Link
            to="/products"
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items?.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-zinc-200 p-4 gap-4 flex items-center justify-center"
              >
                <img
                  src={
                    item.product?.images?.[0]?.url ||
                    "https://placehold.co/100x100?text=?"
                  }
                  alt={item.product?.name}
                  className="w-20 h-20 object-contain mix-blend-multiply rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product?._id}`}
                    className="font-medium text-zinc-900 hover:text-zinc-600 line-clamp-2 text-sm transition-colors"
                  >
                    {item.product?.name}
                  </Link>
                  <p className="text-sm font-bold text-zinc-900 mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                  {item.product?.quantity === 0 && (
                    <span className="text-xs text-red-500 font-medium">
                      Out of stock
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <RiDeleteBinLine size={17} />
                  </button>
                  <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        handleQtyChange(item._id, item.quantity - 1)
                      }
                      className="px-2.5 py-1.5 hover:bg-zinc-100 text-zinc-500 transition-colors"
                    >
                      <RiSubtractLine size={13} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQtyChange(item._id, item.quantity + 1)
                      }
                      disabled={item.quantity >= (item.product?.quantity || 0)}
                      className="px-2.5 py-1.5 hover:bg-zinc-100 text-zinc-500 disabled:opacity-30 transition-colors"
                    >
                      <RiAddLine size={13} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-6 h-fit">
            <h2 className="text-base font-bold text-zinc-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm text-zinc-500 mb-4">
              {items?.map((i) => (
                <div key={i._id} className="flex justify-between gap-2">
                  <span className="truncate">
                    {i.product?.name} × {i.quantity}
                  </span>
                  <span className="font-medium text-zinc-700 shrink-0">
                    ${(i.price * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-100 pt-4 flex justify-between font-bold text-zinc-900 mb-5">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-zinc-900 text-white py-3 rounded-xl font-semibold hover:bg-zinc-700 transition-colors text-sm"
            >
              Checkout
            </button>
            <Link
              to="/products"
              className="block text-center text-sm text-zinc-400 hover:text-zinc-700 mt-3 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
