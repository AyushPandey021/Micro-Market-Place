import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function Home({
  user,
  products,
  loading,
  onDelete,
  onAddImages,
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Product Catalog
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse and manage products from one central page.
            </p>
          </div>
          {user?.role && (
            <Link
              to="/create"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Create product
            </Link>
          )}
        </div>
      </div>

      <div>
        {loading ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
            No products found yet.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                currentUser={user}
                onDelete={onDelete}
                onAddImages={onAddImages}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
