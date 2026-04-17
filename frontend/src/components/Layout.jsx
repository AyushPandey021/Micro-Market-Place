import { Link } from "react-router-dom";

export default function Layout({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/"
            className="text-lg font-semibold text-slate-900 transition hover:text-slate-700"
          >
            Microservices
          </Link>
          <nav className="hidden gap-3 md:flex">
            <Link
              to="/"
              className="rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Products
            </Link>
            <Link
              to="/create"
              className="rounded-full px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Create
            </Link>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                {user.username} · {user.role}
              </span>
              <button
                onClick={onLogout}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
