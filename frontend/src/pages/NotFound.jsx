import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
        Page not found
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">
        Oops, this route does not exist.
      </h1>
      <p className="mt-3 text-slate-600">
        Please go back to the product list and continue from there.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Back to products
      </Link>
    </div>
  );
}
