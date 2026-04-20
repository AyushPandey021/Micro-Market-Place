import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/orders/me");
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (
      !window.confirm(
        `Cancel order ${orderId.slice(-8)}? This cannot be undone.`,
      )
    )
      return;
    try {
      await api.post(`/orders/${orderId}/cancel`);
      alert("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order.");
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "amber",
        bg: "amber-100",
        text: "amber-800",
        icon: "⏳",
      },
      confirmed: {
        color: "indigo",
        bg: "indigo-100",
        text: "indigo-800",
        icon: "✅",
      },
      shipped: { color: "sky", bg: "sky-100", text: "sky-800", icon: "🚚" },
      delivered: {
        color: "emerald",
        bg: "emerald-100",
        text: "emerald-800",
        icon: "📦",
      },
      cancelled: {
        color: "rose",
        bg: "rose-100",
        text: "rose-800",
        icon: "❌",
      },
    };
    return (
      configs[status] || {
        color: "slate",
        bg: "slate-100",
        text: "slate-800",
        icon: "⚫",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center">
          <div className="relative mx-auto h-32 w-32 mb-12">
            <div className="absolute inset-0 h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <div className="h-32 w-32 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-2xl flex items-center justify-center">
              <span className="text-5xl">📋</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-emerald-900 bg-clip-text">
            Loading Orders
          </h1>
          <p className="text-2xl text-slate-600">Fetching your order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-rose-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto h-32 w-32 rounded-3xl bg-gradient-to-br from-rose-100 to-slate-100 p-10 shadow-xl flex items-center justify-center mb-8">
            <span className="text-6xl">⚠️</span>
          </div>
          <h2 className="text-4xl font-black text-rose-900 mb-6">Load Failed</h2>
          <p className="text-2xl text-rose-800 mb-12">{error}</p>
          <button
            onClick={fetchOrders}
            className="btn-primary text-xl py-6 px-12 shadow-2xl flex items-center gap-3 mx-auto"
          >
            🔄 Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-7xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-emerald-900 bg-clip-text text-transparent mb-6">
            Order History
          </h1>
          <p className="text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Track your deliveries, view details, manage returns, and stay updated with every purchase
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32">
            <div className="relative mx-auto mb-16">
              <div className="h-48 w-48 rounded-3xl bg-gradient-to-br from-slate-100 via-indigo-100 to-emerald-100 shadow-2xl p-12 flex flex-col items-center justify-center">
                <span className="text-8xl mb-6 animate-pulse">📦</span>
                <span className="text-3xl font-bold text-slate-600 block">No Orders</span>
              </div>
            </div>
            <h2 className="text-6xl font-black text-slate-900 mb-8 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
              Your Order History is Empty
            </h2>
            <p className="text-2xl text-slate-600 mb-16 max-w-2xl mx-auto leading-relaxed">
              Your purchase history will appear here once you start shopping with us.
            </p>
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
              <Link
                to="/"
                className="btn-primary text-2xl py-8 px-16 shadow-2xl flex items-center gap-4 mx-auto lg:mx-0"
              >
                <span>🛍️</span>
                Start Shopping
              </Link>
              <Link
                to="/cart"
                className="btn-secondary text-2xl py-8 px-16 shadow-xl flex items-center gap-4 mx-auto lg:mx-0 hover:shadow-2xl"
              >
                <span>🛒</span>
                View Cart
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid gap-12">
              {orders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <article
                    key={order.orderId}
                    className="group rounded-3xl border border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-3 p-10 lg:p-12 overflow-hidden relative"
                  >
                    {/* Status Badge */}
                    <div className={`absolute -top-6 left-12 px-8 py-4 rounded-3xl font-bold text-lg shadow-2xl transform rotate-3 ${statusConfig.bg === 'rose-100' ? 'bg-rose-100 text-rose-800 border-2 border-rose-200' : statusConfig.bg === 'emerald-100' ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200' : 'bg-indigo-100 text-indigo-800 border-2 border-indigo-200'}`}>
                      <span className="mr-2">{statusConfig.icon}</span>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>

                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
                      <div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text">
                          Order #{order.orderId.slice(-8).toUpperCase()}
                        </h2>
                        <p className="text-xl text-slate-600">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            weekday: "long",
                          })}
                        </p>
                      </div>
                      {order.status === "pending" && (
                        <button
                          onClick={() => cancelOrder(order.orderId)}
                          className="self-start rounded-3xl bg-gradient-to-r from-rose-500 to-rose-600 px-10 py-5 text-xl font-bold text-white shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all flex items-center gap-3 whitespace-nowrap"
                        >
                          <span>❌</span>
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {/* Content Grid */}
                    <div className="grid gap-12 lg:grid-cols-2">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 text-2xl font-bold shadow-lg">
                            🛍️
                          </span>
                          Order Items ({order.items.length})
                        </h3>
                        <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="group/item p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                              <div className="flex gap-6 items-start">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-200 to-indigo-200 flex items-center justify-center text-2xl font-bold text-slate-500 flex-shrink-0 shadow-md">
                                  {item.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover/item:text-indigo-700 mb-2">
                                    {item.name}
                                  </h4>
                                  <p className="text-lg text-slate-600 mb-2">Qty: {item.quantity}</p>
                                  <p className="text-2xl font-black text-indigo-700">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Subtotal */}
                        <div className="mt-12 pt-10 border-t-4 border-gradient-to-r border-indigo-200 bg-gradient-to-r from-indigo-50 to-slate-50 p-8 rounded-3xl shadow-inner">
                          <div className="flex justify-between items-baseline text-4xl font-black">
                            <span>Total:</span>
                            <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 text-2xl font-bold shadow-lg">
                            📍
                          </span>
                          Delivery Address
                        </h3>
                        <div className="rounded-3xl bg-gradient-to-r from-slate-50 to-emerald-50 p-10 border-4 border-slate-200/50 shadow-xl backdrop-blur-sm space-y-3">
                          <p className="text-2xl font-black text-slate-900">
                            {address.street}
                          </p>
                          <p className="text-xl text-slate-700">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-xl font-bold text-slate-900">
                            {address.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    {order.timeline?.length > 0 && (
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-12 flex items-center gap-4">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 text-2xl font-bold shadow-lg">
                            📊
                          </span>
                          Order Timeline
                        </h3>
                        <div className="relative">
                          <div className="absolute left-[28px] top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-300 to-emerald-300 rounded-full" />
                          <div className="space-y-8">
                            {order.timeline.map((event, index) => {
                              const eventStatus = getStatusConfig(event.status);
                              return (
                                <div key={index} className="flex items-start gap-6 relative">
                                  <div className={`absolute left-8 w-8 h-8 rounded-3xl bg-${eventStatus.bg} border-4 border-white shadow-2xl flex items-center justify-center text-lg font-bold text-${eventStatus.text}`}>
                                    {eventStatus.icon}
                                  </div>
                                  <div className="flex-1 rounded-3xl bg-white/80 backdrop-blur-xl p-8 border border-slate-200 shadow-lg ml-16">
                                    <div className="font-black text-2xl capitalize text-slate-900 mb-2 flex items-center gap-3">
                                      {event.status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                    </div>
                                    <p className="text-lg text-slate-600 mb-4">
                                      {new Date(event.timestamp).toLocaleString()}
                                    </p>
                                    {event.note && (
                                      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 p-6 rounded-2xl border border-slate-200 italic font-semibold text-slate-800">
                                        "{event.note}"
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

