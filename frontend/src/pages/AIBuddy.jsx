import { useState } from "react";
import {
  askBuddy,
  searchProducts,
  parseQuery,
  addSingleProductToCart,
} from "../services/aiBuddyApi";

export default function AIBuddy({ user }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoAdd, setAutoAdd] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) {
      setError("Please enter a question or product request.");
      return;
    }

    setError("");
    setLoading(true);
    setResponse(null);

    try {
      const result = await askBuddy(query, autoAdd);
      setResponse(result.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to reach the AI Buddy service.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search phrase.");
      return;
    }

    setError("");
    setLoading(true);
    setResponse(null);

    try {
      const result = await searchProducts(query);
      setResponse(result.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to perform AI Buddy search.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleParse = async () => {
    if (!query.trim()) {
      setError("Please enter text to parse.");
      return;
    }

    setError("");
    setLoading(true);
    setResponse(null);

    try {
      const result = await parseQuery(query);
      setResponse(result.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to parse your text.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFirstProduct = async () => {
    if (!response?.items?.length) {
      setError("No product found to add to cart.");
      return;
    }

    try {
      const firstProduct = response.items[0];
      await addSingleProductToCart(
        firstProduct.id || firstProduct.productId,
        1,
      );
      setResponse((current) => ({
        ...current,
        cartMessage: `Added ${firstProduct.name || firstProduct.title || "product"} to cart.`,
      }));
      setError("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to add the product to cart.",
      );
    }
  };

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50 p-12 text-center shadow-soft">
          <div className="mx-auto h-24 w-24 rounded-3xl bg-indigo-100 p-6">
            <span className="text-4xl">🤖</span>
          </div>
          <h1 className="mt-6 text-4xl font-bold text-slate-900">AI Buddy</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Login to unlock intelligent product search, natural language
            shopping, and your personal AI shopping assistant.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="space-y-12">
      {/* AI Buddy Hero */}
      <section className="rounded-3xl border border-slate-200/50 bg-gradient-to-br from-indigo-50 via-slate-50 to-white p-16 text-center shadow-soft-lg backdrop-blur-sm">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-indigo-100/80 px-6 py-4 mb-8 shadow-glow backdrop-blur-sm">
            <span className="text-3xl">🤖</span>
            <span className="text-xl font-bold text-indigo-800">Your AI Shopping Assistant</span>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
            AI Buddy
          </h1>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Talk naturally about products. Get semantic search. Auto-add to cart. Parse shopping intent. 
            Your personal AI shopping companion.
          </p>
          <label className="inline-flex items-center gap-4 rounded-3xl bg-gradient-to-r from-slate-50 to-indigo-50 p-4 border border-slate-200 shadow-sm backdrop-blur-sm max-w-max mx-auto">
            <input
              type="checkbox"
              checked={autoAdd}
              onChange={(event) => setAutoAdd(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-lg font-semibold text-slate-800">Auto-add matches to cart</span>
          </label>
        </div>
      </section>

      {/* Input Section */}
      <section className="max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-soft-lg">
          <div className="mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-4">
              Talk to AI
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              Try: "Find affordable blue running shoes under $50" | "Add 2 black t-shirts size M to cart" | "Parse: I need a red evening dress for party"
            </p>
          </div>

          <div className="relative mb-8">
            <textarea
              rows="3"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full input-field text-xl py-8 placeholder-slate-400 resize-none"
              placeholder="Describe what you're looking for..."
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                type="button"
                onClick={handleAsk}
                disabled={loading}
                className="btn-primary px-8 py-3 text-lg flex items-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    AI Thinking...
                  </>
                ) : (
                  "🤖 Ask Buddy"
                )}
              </button>
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="rounded-3xl border-2 border-indigo-200 bg-indigo-50 px-8 py-3 text-lg font-semibold text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md transition-all disabled:opacity-50"
              >
                🔍 Search
              </button>
              <button
                type="button"
                onClick={handleParse}
                disabled={loading}
                className="rounded-3xl border-2 border-slate-200 bg-white px-8 py-3 text-lg font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all disabled:opacity-50"
              >
                📝 Parse
              </button>
            </div>
          </div>
        </div>
      </section>
              <p className="mt-3 text-lg text-slate-600">
                Talk naturally about products. Search semantically. Auto-add to
                cart. Parse shopping intent from text.
              </p>
            </div>
            <label className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:shadow-md">
              <input
                type="checkbox"
                checked={autoAdd}
                onChange={(event) => setAutoAdd(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Auto-add matches to cart
            </label>
          </div>

          <div className="mt-8 relative">
            <textarea
              rows={4}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: 'Find me affordable blue running shoes under $50' or 'Add 2 black t-shirts size M to cart' or 'Parse: I need a red evening dress for party'"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-lg text-slate-900 placeholder-slate-500 shadow-sm outline-none transition-all resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:shadow-md"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAsk}
              disabled={loading}
              className="group rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-4 text-lg font-semibold text-white shadow-soft transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Thinking...
                </>
              ) : (
                "🤖 Ask AI Buddy"
              )}
            </button>
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="rounded-3xl border-2 border-indigo-200 bg-indigo-50 px-8 py-4 text-lg font-semibold text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              🔍 Search Products
            </button>
            <button
              type="button"
              onClick={handleParse}
              disabled={loading}
              className="rounded-3xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              📝 Parse Intent
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-8 text-rose-800 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-2xl">⚠️</span>
              <div>{error}</div>
            </div>
          </div>
        )}

        {loading && (
          <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center shadow-sm before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-indigo-500/5 before:to-slate-500/5">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <div className="h-12 w-12 rounded-full bg-indigo-600" />
            </div>
            <p className="mt-4 text-xl font-semibold text-slate-700">
              AI is processing your request...
            </p>
          </div>
        )}

        {response && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                AI Response
              </h2>
              <pre className="whitespace-pre-wrap rounded-2xl bg-white p-6 text-sm text-slate-700 shadow-inner font-mono">
                {JSON.stringify(response, null, 2)}
              </pre>
              {response.cartMessage && (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-sm font-semibold">
                  {response.cartMessage}
                </div>
              )}
            </div>

            {response.items?.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Matching Products
                  </h2>
                  <button
                    type="button"
                    onClick={handleAddFirstProduct}
                    className="rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg"
                  >
                    🛒 Add First to Cart
                  </button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {response.items.map((item, index) => (
                    <div
                      key={item.id || item.productId || item.name || index}
                      className="group rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                    >
                      <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                        {item.name || item.title || "Product"}
                      </h3>
                      <p className="mb-4 text-sm text-slate-600 line-clamp-3">
                        {item.description || item.summary || "No description."}
                      </p>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-indigo-700">
                          {item.price ? `$${item.price}` : "Price TBD"}
                        </p>
                        {item.stock !== undefined && (
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              item.stock > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {item.stock > 0
                              ? `In Stock: ${item.stock}`
                              : "Out of Stock"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
