export default function AlertBar({ message, error }) {
  if (!message && !error) {
    return null;
  }

  return (
    <div
      className={`mx-auto max-w-7xl rounded-3xl px-8 py-5 shadow-lg transition-all border-l-4 ${
        message
          ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-900"
          : "border-rose-400 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-900"
      }`}
    >
      <div className="flex items-start gap-3">
        {message ? (
          <span className="mt-0.5 text-2xl">✅</span>
        ) : (
          <span className="mt-0.5 text-2xl">⚠️</span>
        )}
        <div className="flex-1">
          <p className="font-semibold text-lg">{message || error}</p>
        </div>
      </div>
    </div>
  );
}
