import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";

const initialProduct = {
  title: "",
  description: "",
  priceAmount: "",
  priceCurrency: "INR",
};

export default function CreateProduct({
  user,
  onCreate,
  showMessage,
  showError,
}) {
  const [productForm, setProductForm] = useState(initialProduct);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (selectedFiles) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    showError("");
    showMessage("");

    if (!productForm.title || !productForm.priceAmount || files.length === 0) {
      showError("Title, price, and at least one image are required.");
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({
        title: productForm.title,
        description: productForm.description,
        priceAmount: Number(productForm.priceAmount),
        priceCurrency: productForm.priceCurrency,
        images: files,
      });
      showMessage("Product created successfully!");
      setProductForm(initialProduct);
      setFiles([]);
      navigate("/");
    } catch (error) {
      showError(error?.message || "Product creation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || (user.role !== "seller" && user.role !== "admin")) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 p-16 text-center shadow-xl">
          <div className="mx-auto h-24 w-24 rounded-3xl bg-rose-100 p-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="mt-8 text-3xl font-bold text-slate-900">
            Access Restricted
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-md mx-auto">
            Sellers and admins can create products. Please log in with
            appropriate role.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 p-16 shadow-soft-lg mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-indigo-900 bg-clip-text text-transparent mb-6">
                Create Product
              </h1>
              <p className="text-2xl text-slate-600 leading-relaxed max-w-2xl">
                Add your product with rich details. Goes live instantly after
                upload.
              </p>
            </div>
            <div className="text-right lg:text-left">
              <div className="inline-flex items-center gap-3 rounded-3xl bg-emerald-100 px-8 py-4 text-xl font-bold text-emerald-800 shadow-xl">
                <span>⚡</span>
                Live Immediately
              </div>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Title
                </span>
                <input
                  name="title"
                  value={productForm.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-xl text-slate-900 placeholder-slate-500 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  placeholder="e.g. Premium Wireless Headphones"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </span>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-slate-900 placeholder-slate-500 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  placeholder="Tell customers about your product..."
                />
              </label>
            </div>
            <div className="space-y-6">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">
                  Price Amount
                </span>
                <input
                  name="priceAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.priceAmount}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-2xl font-bold text-slate-900 text-right shadow-sm outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  placeholder="99.99"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-2">
                  Currency
                </span>
                <select
                  name="priceCurrency"
                  value={productForm.priceCurrency}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-lg text-slate-900 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="USD">USD $</option>
                  <option value="EUR">EUR €</option>
                  <option value="GBP">GBP £</option>
                  <option value="INR">INR ₹</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 text-xl font-bold shadow-md">
                📸
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Product Images
              </h3>
              <p className="text-slate-600 mb-6">
                Upload up to 10 high-quality images (JPG, PNG). First image
                becomes cover.
              </p>
              <FileUploader
                files={files}
                onFilesChange={handleFilesChange}
                onRemoveFile={removeFile}
                label="Drag & drop or click to browse"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting || files.length === 0}
            className="group mx-auto flex w-full max-w-md items-center gap-3 rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-xl font-bold text-white shadow-2xl transition-all hover:shadow-3xl hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                Publishing...
              </>
            ) : (
              <>
                <span>🚀</span>
                Publish Product
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
