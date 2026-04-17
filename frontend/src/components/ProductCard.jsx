import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({
  product,
  currentUser,
  onDelete,
  onAddImages,
}) {
  const [files, setFiles] = useState([]);
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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/product/${product._id}`}
          className="text-left text-xl font-semibold text-slate-900 transition hover:text-slate-700"
        >
          {product.title}
        </Link>
        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {product.priceCurrency} {product.priceAmount}
        </span>
      </div>
      <p className="mb-3 text-slate-600">
        {product.description || "No description available."}
      </p>
      {product.images && product.images.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-3">
          {product.images.map((image) => (
            <img
              key={image.url}
              src={image.url}
              alt={product.title}
              className="h-32 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      ) : (
        <div className="mb-3 rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
          No product images yet.
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">
          Seller: {product.seller || "unknown"}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/product/${product._id}`}
            className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            View details
          </Link>
          {owner && (
            <button
              onClick={() => onDelete(product._id)}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {owner && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700">
            Add new images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-2xl border border-slate-200 p-2"
          />
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Upload Images
          </button>
        </form>
      )}
    </div>
  );
}
