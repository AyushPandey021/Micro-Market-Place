import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Cart({ user }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.patch(`/cart/items/${productId}`, { quantity });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/items/${productId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const createOrder = async () => {
    try {
      const response = await api.post("/orders", { shippingAddress: address });
      alert(`Order created! Order ID: ${response.data.data.orderId}`);
      clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading cart...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
          {cart.items.map((item) => (
            <div key={item.productId} className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold">{item.name || "Product"}</h3>
              <p>Price: ${item.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, parseInt(e.target.value))
                  }
                  className="border px-2 py-1 w-16"
                />
                <button
                  onClick={() => removeItem(item.productId)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear Cart
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Country"
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={address.zipCode}
              onChange={(e) =>
                setAddress({ ...address, zipCode: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">
              Total: ${cart.totalAmount || 0}
            </h3>
            <button
              onClick={createOrder}
              className="bg-green-500 text-white px-6 py-3 rounded mt-4 w-full"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
