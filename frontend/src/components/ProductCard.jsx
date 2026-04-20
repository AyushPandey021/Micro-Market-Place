import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

export default function ProductCard({
  product,
  currentUser,
  onDelete,
  onAddImages,
}) {
  const [files, setFiles] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const owner =
    currentUser &&
    (currentUser.role === "admin" || currentUser.id === product.seller);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (files.length === 0) return;
    onAddImages(product._id, files);
    setFiles([]);
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await api.post("/cart/items", {
        productId: product._id,
        quantity,
      });
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-soft transition-all hover:shadow-soft-lg hover:shadow-glow hover:-translate-y-2">
      <header className="mb-6 space-y-3">
        <div className="flex items-start justify-between">
          <Link
            to={`/product/${product._id}`}
            className="text-left text-2xl font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 transition-all group-hover:font-black"
          >
            {product.title}
          </Link>
          <span className="rounded-3xl bg-gradient-to-r from-indigo-100 to-indigo-200 px-4 py-2 text-lg font-bold text-indigo-800 shadow-sm whitespace-nowrap">
            {product.priceCurrency} {product.priceAmount}
          </span>
        </div>
        <p className="text-slate-600 leading-relaxed line-clamp-3">
          {product.description || "No description available."}
        </p>
      </header>

      {product.images && product.images.length > 0 ? (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {product.images.slice(0, 3).map((image, index) => (
            <Link
              key={image.url || index}
              to={`/product/${product._id}`}
              className="group/image block overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <img
                src={image.url}
                alt={`${product.title} - image ${index + 1}`}
                className="h-48 w-full object-cover transition-all group-hover/image:scale-105 group-hover/image:brightness-105"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50 p-12 text-center shadow-inner">
          <span className="mx-auto mb-4 inline-block text-5xl">🖼️</span>
          <p className="text-lg font-semibold text-slate-600">No images yet</p>
          <p className="text-sm text-slate-500">Add photos to attract buyers</p>
        </div>
      )}

      <footer className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">
            Seller:{" "}
            <span className="font-semibold text-slate-900">
              {product.seller || "Unknown"}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to={`/product/${product._id}`}
            className="btn-secondary text-sm px-6 py-2.5"
          >
            View Details →
          </Link>

          {currentUser && !owner && (
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="input-field w-20 text-center text-lg font-bold"
              />
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding...
                  </>
                ) : (
                  "🛒 Add to Cart"
                )}
              </button>
            </div>
          )}

          {owner && (
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(product._id)}
                className="rounded-3xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-600 hover:shadow-md hover:-translate-y-0.5"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {owner && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"
          >
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="text-indigo-600">📸</span>
              Add new images
            </label>
            <div className="flex gap-3">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="input-field flex-1 file:mr-4 file:py-2.5 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-700 file:transition-all file:hover:bg-indigo-500/20 cursor-pointer"
              />
              <button
                type="submit"
                disabled={files.length === 0}
                className="btn-primary px-6 py-2.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload ({files.length})
              </button>
            </div>
          </form>
        )}
      </footer>
    </article>
  );
}
