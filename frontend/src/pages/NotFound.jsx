import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Icon */}
        <div className="relative mx-auto mb-12">
          <div className="h-40 w-40 rounded-3xl bg-gradient-to-br from-rose-100 via-rose-200 to-slate-100 p-10 shadow-2xl ring-8 ring-rose-200/50 mx-auto">
            <span className="text-8xl block animate-bounce">🚫</span>
          </div>
          <div className="absolute -top-4 -right-4 h-20 w-20 bg-gradient-to-r from-indigo-500 to-slate-900 rounded-3xl flex items-center justify-center shadow-xl animate-pulse-soft">
            <span className="text-xl font-bold text-white">404</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 max-w-2xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-rose-600 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
            Page Not Found
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed mb-12">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to a parallel universe.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/"
              className="group btn-primary text-xl py-8 px-12 shadow-2xl flex items-center gap-3 justify-center mx-auto sm:mx-0 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>🏠</span>
              Back to Marketplace
            </Link>
            <Link
              to="/create"
              className="group btn-secondary text-xl py-8 px-12 shadow-xl flex items-center gap-3 justify-center mx-auto sm:mx-0 hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>✨</span>
              Create Something New
            </Link>
          </div>

          {/* Subtle CTA */}
          <div className="pt-12 border-t border-slate-200">
            <p className="text-slate-500 text-lg italic">
              "Sometimes the best products are the ones you haven&apos;t
              discovered yet"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
