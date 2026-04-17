import { useState, useEffect } from "react";
import api from "../services/api";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/me");
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/cancel`);
      alert("Order cancelled");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{order.orderId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        order.status === "pending"
                          ? "text-yellow-600"
                          : order.status === "confirmed"
                            ? "text-blue-600"
                            : order.status === "shipped"
                              ? "text-purple-600"
                              : order.status === "delivered"
                                ? "text-green-600"
                                : "text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: ${order.totalAmount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  {order.status === "pending" && (
                    <button
                      onClick={() => cancelOrder(order.orderId)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm mt-2"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    Product ID: {item.productId} - Quantity: {item.quantity} -
                    Price: ${item.price}
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium mb-2">Shipping Address:</h4>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}, {order.shippingAddress.country}{" "}
                  {order.shippingAddress.zipCode}
                </p>
              </div>

              {order.timeline && order.timeline.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Timeline:</h4>
                  {order.timeline.map((event, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {event.status} -{" "}
                      {new Date(event.timestamp).toLocaleString()}
                      {event.note && ` - ${event.note}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
