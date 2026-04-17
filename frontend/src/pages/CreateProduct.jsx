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
      showMessage("Product created successfully.");
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
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
        <p className="text-slate-700">
          You must be signed in as a seller or admin to create a product.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create a new product
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload product details and multiple images in one place.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                value={productForm.title}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Price</span>
              <input
                name="priceAmount"
                type="number"
                value={productForm.priceAmount}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Currency</span>
            <select
              name="priceCurrency"
              value={productForm.priceCurrency}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Description
            </span>
            <textarea
              name="description"
              value={productForm.description}
              onChange={handleChange}
              rows="4"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>

          <FileUploader
            files={files}
            onFilesChange={handleFilesChange}
            onRemoveFile={removeFile}
            label="Product images"
          />

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create product
          </button>
        </form>
      </div>
    </div>
  );
}
