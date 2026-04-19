import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "./services/api";
import Layout from "./components/Layout";
import AlertBar from "./components/AlertBar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import CreateProduct from "./pages/CreateProduct";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AIBuddy from "./pages/AIBuddy";
import NotFound from "./pages/NotFound";

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!message && !error) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setMessage("");
      setError("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [message, error]);

  const showMessage = (text) => {
    setError("");
    setMessage(text);
  };

  const showError = (text) => {
    setMessage("");
    setError(text);
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (_error) {
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.data || []);
    } catch (fetchError) {
      console.error(fetchError);
      showError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ username, password }) => {
    const response = await api.post("/auth/login", { username, password });
    setUser(response.data.user);
    await fetchProducts();
  };

  const handleRegister = async (payload) => {
    const response = await api.post("/auth/register", payload);
    setUser(response.data.user);
    await fetchProducts();
  };

  const handleCreateProduct = async ({
    title,
    description,
    priceAmount,
    priceCurrency,
    images,
  }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priceAmount", priceAmount);
    formData.append("priceCurrency", priceCurrency);
    images.forEach((file) => formData.append("Images", file));

    await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchProducts();
  };

  const handleDeleteProduct = async (productId) => {
    await api.delete(`/products/${productId}`);
    showMessage("Product deleted successfully.");
    await fetchProducts();
  };

  const handleAddProductImages = async (productId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("Images", file));

    await api.put(`/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await fetchProducts();
  };

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    showMessage("Logged out successfully.");
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <Layout user={user} onLogout={handleLogout} />
        <main className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <AlertBar message={message} error={error} />
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    user={user}
                    products={products}
                    loading={loading}
                    onDelete={async (id) => {
                      try {
                        await handleDeleteProduct(id);
                      } catch (error) {
                        showError("Failed to delete product.");
                      }
                    }}
                    onAddImages={async (id, files) => {
                      try {
                        await handleAddProductImages(id, files);
                        showMessage("Product images added successfully.");
                      } catch (error) {
                        showError("Failed to upload product images.");
                      }
                    }}
                  />
                }
              />
              <Route
                path="/auth"
                element={
                  <AuthPage
                    onLogin={async (payload) => {
                      try {
                        await handleLogin(payload);
                        showMessage("Login successful.");
                      } catch (error) {
                        showError(
                          error.response?.data?.error || "Login failed.",
                        );
                        throw error;
                      }
                    }}
                    onRegister={async (payload) => {
                      try {
                        await handleRegister(payload);
                        showMessage("Registration successful.");
                      } catch (error) {
                        showError(
                          error.response?.data?.error || "Registration failed.",
                        );
                        throw error;
                      }
                    }}
                    showError={showError}
                    showMessage={showMessage}
                  />
                }
              />
              <Route
                path="/create"
                element={
                  <CreateProduct
                    user={user}
                    onCreate={async (payload) => {
                      try {
                        await handleCreateProduct(payload);
                      } catch (error) {
                        showError(
                          error.response?.data?.message ||
                            "Product creation failed.",
                        );
                        throw error;
                      }
                    }}
                    showMessage={showMessage}
                    showError={showError}
                  />
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProductDetails
                    user={user}
                    showMessage={showMessage}
                    showError={showError}
                  />
                }
              />
              <Route path="/cart" element={<Cart user={user} />} />
              <Route path="/orders" element={<Orders user={user} />} />
              <Route path="/assistant" element={<AIBuddy user={user} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
