import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Cart({ user }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      setUpdating(true);
      await api.patch(`/cart/items/${productId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      await api.delete(`/cart/items/${productId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Clear entire cart? This cannot be undone.")) return;
    try {
      setUpdating(true);
      await api.delete("/cart");
      setCart(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setUpdating(false);
    }
  };

  const validateAddress = () => {
    const errors = {};
    if (!address.street.trim()) errors.street = "Street address required";
    if (!address.city.trim()) errors.city = "City required";
    if (!address.state.trim()) errors.state = "State required";
    if (!address.country.trim()) errors.country = "Country required";
    if (!address.zipCode.trim()) errors.zipCode = "ZIP code required";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createOrder = async () => {
    if (!validateAddress()) return;
    try {
      setPlacingOrder(true);
      const response = await api.post("/orders", { shippingAddress: address });
      alert(
        `Order #${response.data.data.orderId.slice(-8)} created successfully!`,
      );
      setCart(null);
      setAddress({ street: "", city: "", state: "", country: "", zipCode: "" });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Order failed. Please check details and try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center">
          <div className="relative mx-auto h-32 w-32 mb-12">
            <div className="absolute inset-0 h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-2xl flex items-center justify-center p-8">
              <span className="text-5xl">🛒</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-emerald-900 bg-clip-text">
            Loading Cart...
          </h1>
          <p className="text-2xl text-slate-600">
            Getting your shopping cart ready
          </p>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="mx-auto h-48 w-48 rounded-3xl bg-gradient-to-br from-emerald-100 to-slate-100 shadow-2xl p-12 flex flex-col items-center justify-center">
            <span className="text-7xl mb-4">🛒</span>
            <span className="text-3xl font-bold text-slate-600 block">
              Empty Cart
            </span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 bg-gradient-to-r from-slate-900 to-emerald-900 bg-clip-text">
            Your Cart is Empty
          </h1>
          <p className="text-2xl text-slate-600 mb-12 leading-relaxed">
            No items in cart yet. Start shopping to fill it up with amazing
            products!
          </p>
          <Link
            to="/"
            className="group btn-primary text-2xl py-8 px-12 shadow-2xl flex items-center gap-4 justify-center mx-auto transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>🛍️</span>
            Start Shopping Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-7xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-indigo-900 bg-clip-text text-transparent mb-6">
            Shopping Cart
          </h1>
          <p className="text-3xl text-slate-600 max-w-3xl mx-auto">
            Review your selections, adjust quantities, and get ready to checkout
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Items List */}
          <section aria-label="Cart items" className="space-y-8">
            {/* Header Bar */}
            <div className="flex items-center justify-between p-8 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span>🛒</span>
                Cart Items ({cart.items.length})
              </h2>
              <button
                onClick={clearCart}
                disabled={updating}
                className="group rounded-3xl border-2 border-rose-200 bg-rose-50 px-8 py-4 text-xl font-bold text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-100 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>🗑️</span>
                Clear All
              </button>
            </div>

            {/* Items */}
            <div className="space-y-6">
              {cart.items.map((item) => (
                <article
                  key={item.productId}
                  className="group rounded-3xl border border-slate-200/50 bg-white shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all hover:-translate-y-2 p-8"
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="relative h-32 w-32 flex-shrink-0 rounded-2xl bg-gradient-to-br from-slate-100 to-indigo-100 overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5" />
                      <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-slate-400">
                        {item.name?.[0]?.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                        {item.name || `Product ${item.productId.slice(-8)}`}
                      </h3>
                      <p className="text-3xl font-black text-indigo-700 mb-1">
                        ${item.price.toFixed(2)}{" "}
                        <span className="text-lg text-slate-500 font-normal">
                          each
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      disabled={updating}
                      className="group/remove p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-3xl shadow-sm transition-all hover:shadow-md hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed absolute -top-4 -right-4 bg-white"
                      title="Remove item"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Quantity & Subtotal */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <label className="text-xl font-bold text-slate-800">
                        Quantity:
                      </label>
                      <div className="flex items-center bg-slate-50 rounded-3xl p-2 border-2 border-slate-200 shadow-inner">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={updating || item.quantity <= 1}
                          className="h-14 w-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-2xl font-bold text-slate-500 hover:text-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.productId,
                              parseInt(e.target.value),
                            )
                          }
                          disabled={updating}
                          className="h-14 w-24 border-0 bg-transparent text-center text-3xl font-black text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={updating}
                          className="h-14 w-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-2xl font-bold text-slate-500 hover:text-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Checkout Panel */}
          <aside
            aria-label="Checkout"
            className="lg:sticky lg:top-24 lg:h-screen lg:flex lg:flex-col lg:justify-center"
          >
            <div className="space-y-8 lg:max-h-[80vh] lg:overflow-y-auto">
              {/* Address Form */}
              <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl p-10 shadow-soft-lg">
                <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span>📍</span>
                  Shipping Address
                </h2>
                <p className="text-slate-600 mb-8 text-lg">
                  Complete your delivery details
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-slate-800 mb-3">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main St, Apt 4B"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      className={`w-full input-field py-6 text-lg rounded-3xl ${addressErrors.street ? "border-rose-300 bg-rose-50 ring-2 ring-rose-200" : ""}`}
                    />
                    {addressErrors.street && (
                      <p className="mt-2 text-rose-600 flex items-center gap-2 font-semibold">
                        <span>⚠️</span> {addressErrors.street}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-slate-800 mb-3">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="New York"
                        value={address.city}
                        onChange={(e) =>
                          setAddress({ ...address, city: e.target.value })
                        }
                        className={`w-full input-field py-6 text-lg rounded-3xl ${addressErrors.city ? "border-rose-300 bg-rose-50 ring-2 ring-rose-200" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-slate-800 mb-3">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="NY"
                        value={address.state}
                        onChange={(e) =>
                          setAddress({ ...address, state: e.target.value })
                        }
                        className={`w-full input-field py-6 text-lg rounded-3xl ${addressErrors.state ? "border-rose-300 bg-rose-50 ring-2 ring-rose-200" : ""}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold text-slate-800 mb-3">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="United States"
                        value={address.country}
                        onChange={(e) =>
                          setAddress({ ...address, country: e.target.value })
                        }
                        className={`w-full input-field py-6 text-lg rounded-3xl ${addressErrors.country ? "border-rose-300 bg-rose-50 ring-2 ring-rose-200" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-slate-800 mb-3">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        placeholder="10001"
                        value={address.zipCode}
                        onChange={(e) =>
                          setAddress({ ...address, zipCode: e.target.value })
                        }
                        className={`w-full input-field py-6 text-lg rounded-3xl ${addressErrors.zipCode ? "border-rose-300 bg-rose-50 ring-2 ring-rose-200" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Totals & CTA */}
              <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-12 shadow-2xl ring-4 ring-emerald-200/50">
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline text-center">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">
                      Subtotal:
                    </span>
                    <span className="text-5xl font-black bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent tracking-tight">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="text-center py-6 border-t border-emerald-200 text-xl text-emerald-700 font-semibold bg-emerald-50/50 rounded-2xl">
                    Free shipping • Taxes calculated at checkout
                  </div>
                  <button
                    onClick={createOrder}
                    disabled={placingOrder}
                    className="w-full group rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 px-8 py-8 text-2xl font-black text-white shadow-2xl ring-4 ring-emerald-400/30 transition-all hover:shadow-3xl hover:-translate-y-2 active:scale-[0.98] flex items-center justify-center gap-4"
                  >
                    {placingOrder ? (
                      <>
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent shadow-lg" />
                        Processing Secure Order...
                      </>
                    ) : (
                      <>
                        <span>🧾</span>
                        Complete Order & Checkout
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
