import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import FileUploader from "../components/FileUploader";

export default function ProductDetails({ user, showMessage, showError }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      showError("Product not found or could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${id}`);
      showMessage("Product deleted successfully.");
      navigate("/");
    } catch (error) {
      showError("Delete failed.");
    }
  };

  const handleFilesChange = (selectedFiles) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const isOwner = Boolean(
    user && product && (user.role === "admin" || product.seller === user.id),
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    showError("");
    showMessage("");

    if (!files.length) {
      showError("Select at least one image before uploading.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("Images", file));

    setSubmitting(true);
    try {
      await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showMessage("Images uploaded successfully.");
      setFiles([]);
      fetchProduct();
    } catch (error) {
      showError("Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
        No product found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Product details
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {product.title}
            </h1>
            <p className="mt-1 text-slate-600">
              {product.description || "No description provided."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Back
            </button>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_0.65fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="text-sm text-slate-500">Price</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {product.priceCurrency} {product.priceAmount}
                </div>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="text-sm text-slate-500">Seller</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {product.seller || "unknown"}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {product.images && product.images.length > 0 ? (
                product.images.map((image) => (
                  <img
                    key={image.fileId || image.url}
                    src={image.url}
                    alt={product.title}
                    className="h-56 w-full rounded-3xl object-cover"
                  />
                ))
              ) : (
                <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-500">
                  No images available.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-4 text-slate-700">
              <h2 className="text-lg font-semibold text-slate-900">
                Update product images
              </h2>
              <p className="mt-1 text-sm">
                Upload more images to append to this product.
              </p>
            </div>
            {isOwner ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <FileUploader
                  files={files}
                  onFilesChange={handleFilesChange}
                  onRemoveFile={removeFile}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Upload images
                </button>
              </form>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                Only the seller or admin can upload more images.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
