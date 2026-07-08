import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../store/slices/ordersSlice";
import Breadcrumb from "../components/common/Breadcrumb";
import toast from "react-hot-toast";
import { RiBankCardLine, RiTruckLine, RiCheckLine } from "react-icons/ri";

const STEPS = ["Review", "Shipping", "Payment"];

const INPUT_CLS =
  "w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 bg-zinc-50 focus:bg-white transition-all";
const BTN_PRIMARY =
  "flex-1 bg-zinc-900 text-white py-3 rounded-xl font-semibold hover:bg-zinc-700 disabled:opacity-50 transition-colors text-sm";
const BTN_SECONDARY =
  "flex-1 border border-zinc-200 py-3 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors";

const Req = () => <span className="text-red-500 ml-0.5">*</span>;
const Opt = () => (
  <span className="text-zinc-400 font-normal ml-1">(optional)</span>
);

const EMPTY_ADDR = {
  province: "",
  district: "",
  municipality: "",
  wardNo: "",
  town: "",
  landmark: "",
};

const ADDR_FIELDS = [
  { key: "province", label: "Province No.", required: true, full: false },
  { key: "district", label: "District", required: true, full: false },
  { key: "municipality", label: "Municipality", required: true, full: false },
  { key: "wardNo", label: "Ward No.", required: true, full: false },
  { key: "town", label: "Town", required: true, full: true },
  { key: "landmark", label: "Landmark", required: false, full: true },
];
export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(EMPTY_ADDR);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showDummyPay, setShowDummyPay] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    if (items?.length === 0) navigate("/cart");
  }, [items?.length]);

  useEffect(() => {
    if (!user?.addresses?.length) {
      setSelectedAddressId(null);
      setAddress(EMPTY_ADDR);
      return;
    }

    const defaultAddress =
      user.addresses.find((a) => a.isDefault) || user.addresses[0];
    setSelectedAddressId(defaultAddress._id);
    setAddress({
      province: defaultAddress.province || "",
      district: defaultAddress.district || "",
      municipality: defaultAddress.municipality || "",
      wardNo: defaultAddress.wardNo || "",
      town: defaultAddress.town || "",
      landmark: defaultAddress.landmark || "",
    });
  }, [user?.addresses]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { province, district, municipality, wardNo, town } = address;
    if (!province || !district || !municipality || !wardNo || !town) {
      toast.error("Please fill all required address fields");
      return;
    }
    setStep(3);
  };

  const placeOrder = async () => {
    setLoading(true);
    const res = await dispatch(
      createOrder({ shippingAddress: address, paymentMethod }),
    );
    setLoading(false);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Order placed!");
      navigate(`/orders/${res.payload._id}`);
    } else {
      toast.error(res.payload || "Order failed");
    }
  };

  if (items?.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-10 overflow-x-auto p-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step > i + 1
                    ? "bg-emerald-500 text-white"
                    : step === i + 1
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {step > i + 1 ? <RiCheckLine size={14} /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium ${step === i + 1 ? "text-zinc-900" : "text-zinc-400"}`}
              >
                {s}
              </span>
            </div>
            {i < STEPS?.length - 1 && (
              <div className="w-10 h-px bg-zinc-200 mx-3" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1 — Review */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-base font-bold text-zinc-900 mb-5">
                Review Your Cart
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <img
                      src={
                        item.product?.images?.[0]?.url ||
                        "https://placehold.co/60x60"
                      }
                      alt=""
                      className="w-14 h-14 object-cover rounded-xl bg-zinc-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-zinc-900 text-sm shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className={`w-full mt-6 ${BTN_PRIMARY}`}
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2 — Shipping */}
          {step === 2 && (
            <form
              onSubmit={handleAddressSubmit}
              className="bg-white rounded-2xl border border-zinc-200 p-6"
            >
              <h2 className="text-base font-bold text-zinc-900 mb-5">
                Shipping Address
              </h2>

              {user?.addresses?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Saved Addresses
                  </p>
                  <div className="space-y-2">
                    {user.addresses.map((a) => (
                      <button
                        key={a._id}
                        type="button"
                        onClick={() => {
                          setSelectedAddressId(a._id);
                          setAddress({
                            province: a.province || "",
                            district: a.district || "",
                            municipality: a.municipality || "",
                            wardNo: a.wardNo || "",
                            town: a.town || "",
                            landmark: a.landmark || "",
                          });
                        }}
                        className={`w-full text-left rounded-xl border p-3.5 text-sm transition-colors ${selectedAddressId === a._id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="font-semibold text-zinc-800">
                              {a.label || "Address"}
                            </span>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                              {a.municipality}, Ward {a.wardNo}, {a.town}
                              <br />
                              {a.district}, Province {a.province}
                              {a.landmark && (
                                <>
                                  <br />
                                  <span className="text-zinc-400">
                                    Near: {a.landmark}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                          {a.isDefault && (
                            <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                              Default
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    Or enter a new address below
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ADDR_FIELDS.map(({ key, label, required, full }) => (
                  <div key={key} className={full ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                      {label}
                      {required ? <Req /> : <Opt />}
                    </label>
                    <input
                      value={address[key]}
                      onChange={(e) => {
                        setSelectedAddressId(null);
                        setAddress((p) => ({ ...p, [key]: e.target.value }));
                      }}
                      className={INPUT_CLS}
                      required={required}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm  :flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={BTN_SECONDARY}
                >
                  Back
                </button>
                <button type="submit" className={BTN_PRIMARY}>
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* Step 3 — Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6">
              <h2 className="text-base font-bold text-zinc-900 mb-5">
                Payment Method
              </h2>
              <div className="space-y-3 mb-6">
                {[
                  {
                    value: "DummyPay",
                    label: "DummyPay",
                    icon: RiBankCardLine,
                    desc: "Pay online instantly",
                  },
                  {
                    value: "COD",
                    label: "Cash on Delivery",
                    icon: RiTruckLine,
                    desc: "Pay when you receive",
                  },
                ].map(({ value, label, icon: Icon, desc }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-4 border-2 rounded-2xl p-4 cursor-pointer transition-colors ${
                      paymentMethod === value
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === value ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"}`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-zinc-900 text-sm">
                        {label}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
                    </div>
                    {paymentMethod === value && (
                      <div className="w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                        <RiCheckLine size={12} className="text-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className={BTN_SECONDARY}>
                  Back
                </button>
                <button
                  onClick={() =>
                    paymentMethod === "DummyPay"
                      ? setShowDummyPay(true)
                      : placeOrder()
                  }
                  disabled={loading}
                  className={BTN_PRIMARY}
                >
                  {loading
                    ? "Placing Order…"
                    : paymentMethod === "DummyPay"
                      ? "Pay Now"
                      : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 h-fit">
          <h2 className="text-base font-bold text-zinc-900 mb-4">Summary</h2>
          <div className="space-y-2 text-sm text-zinc-500 mb-4">
            {items.map((i) => (
              <div key={i._id} className="flex justify-between gap-2">
                <span className="truncate">
                  {i.product?.name} ×{i.quantity}
                </span>
                <span className="font-medium text-zinc-700 shrink-0">
                  ${(i.price * i.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-100 pt-3 flex justify-between font-bold text-zinc-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* DummyPay Modal */}
      {showDummyPay && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RiBankCardLine size={28} className="text-zinc-700" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900">DummyPay</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Simulated secure payment
              </p>
            </div>
            <div className="bg-zinc-50 rounded-xl p-4 mb-6 space-y-3 border border-zinc-100">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Card Number</span>
                <span className="font-mono font-semibold text-zinc-800">
                  4242 4242 4242 4242
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Amount</span>
                <span className="font-bold text-zinc-900 text-base">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                <span className="text-emerald-600 font-semibold">Ready</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDummyPay(false)}
                className={BTN_SECONDARY}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDummyPay(false);
                  placeOrder();
                }}
                disabled={loading}
                className={BTN_PRIMARY}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
