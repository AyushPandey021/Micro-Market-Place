export default function AlertBar({ message, error }) {
  if (!message && !error) {
    return null;
  }

  return (
    <div
      className={`mx-auto max-w-7xl rounded-3xl px-5 py-4 text-sm font-medium ${message ? "bg-emerald-50 text-emerald-800" : ""} ${error ? "bg-rose-50 text-rose-800" : ""}`}
    >
      {message || error}
    </div>
  );
}
