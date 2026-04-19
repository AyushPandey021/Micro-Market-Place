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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-12 shadow-soft-lg backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-indigo-100 px-6 py-3 mb-8 shadow-glow">
            <span className="text-2xl">🚀</span>
            <span className="text-lg font-bold text-indigo-800">
              Live Marketplace
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
            Product Catalog
          </h1>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover amazing products, manage your listings, and shop from our
            curated microservices marketplace.
          </p>
          {user?.role === "seller" || user?.role === "admin" ? (
            <Link
              to="/create"
              className="btn-primary text-xl px-10 py-6 shadow-2xl inline-flex items-center gap-3 mx-auto"
            >
              <span>✨</span>
              Create Your Product
            </Link>
          ) : (
            <Link
              to="/"
              className="btn-secondary text-xl px-10 py-6 shadow-xl inline-flex items-center gap-3 mx-auto"
            >
              <span>👀</span>
              Browse Products
            </Link>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center py-32">
              <div className="relative mx-auto h-24 w-24 mb-8">
                <div className="absolute inset-0 h-24 w-24 animate-ping rounded-full bg-indigo-400 opacity-75" />
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Loading Marketplace...
              </h2>
              <p className="text-xl text-slate-600">
                Fetching the latest products
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <div className="mx-auto h-32 w-32 rounded-3xl bg-gradient-to-br from-slate-100 to-indigo-100 p-8 shadow-2xl mb-12 flex flex-col items-center justify-center">
                <span className="text-5xl mb-2">📦</span>
                <span className="text-lg font-bold text-slate-600">Empty</span>
              </div>
              <h2 className="text-5xl font-black text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
                No Products Yet
              </h2>
              <p className="text-2xl text-slate-600 mb-12 max-w-lg mx-auto leading-relaxed">
                Be the first to create a product and kickstart our marketplace!
              </p>
              {user && (
                <Link
                  to="/create"
                  className="btn-primary text-xl px-10 py-6 shadow-2xl inline-flex items-center gap-3 mx-auto"
                >
                  <span>🚀</span>
                  Be First Creator
                </Link>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-900">
                    Featured Products ({products.length})
                  </h2>
                  <p className="text-xl text-slate-600 mt-2">
                    Explore our latest listings
                  </p>
                </div>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
