import { Link } from "react-router-dom";

export default function Layout({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-xl shadow-soft">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-slate-100 px-4 py-3 text-xl font-bold text-slate-900 transition-all hover:from-indigo-600/20 hover:shadow-glow hover:-translate-y-0.5"
          >
            <span className="text-2xl animate-pulse-soft">🛒</span>
            Microservices Marketplace
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              to="/"
              className="rounded-3xl px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
            >
              Products
            </Link>
            {user && (
              <>
                <Link
                  to="/cart"
                  className="rounded-3xl px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
                >
                  Cart
                </Link>
                <Link
                  to="/orders"
                  className="rounded-3xl px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
                >
                  Orders
                </Link>
                <Link
                  to="/assistant"
                  className="rounded-3xl px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
                >
                  AI Buddy
                </Link>
              </>
            )}
            {user?.role && (
              <Link
                to="/create"
                className="rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
              >
                + Create Product
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-50 to-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm">
                {user.username} · {user.role}
              </span>
              <button
                onClick={onLogout}
                className="btn-primary text-sm px-5 py-3"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary text-sm px-5 py-3">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
