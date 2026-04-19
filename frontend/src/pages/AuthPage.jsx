import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialAuth = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "user",
};

export default function AuthPage({
  onLogin,
  onRegister,
  showError,
  showMessage,
}) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialAuth);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setForm(initialAuth);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    showError("");
    showMessage("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await onLogin({ username: form.username, password: form.password });
        showMessage("Login successful.");
      } else {
        await onRegister({
          username: form.username,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          role: form.role,
        });
        showMessage("Registration successful.");
      }
      navigate("/");
    } catch (error) {
      showError(error?.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="w-full max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="mx-auto h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-slate-900 flex items-center justify-center mb-8 shadow-2xl ring-4 ring-indigo-500/20">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent mb-6">
            {mode === "login" ? "Welcome Back" : "Join Marketplace"}
          </h1>
          <p className="text-2xl text-slate-600 max-w-lg mx-auto leading-relaxed">
            {mode === "login"
              ? "Access your account securely"
              : "Create your seller/buyer account"}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200/50 bg-white/90 backdrop-blur-xl p-12 shadow-soft-lg shadow-glow">
          {/* Toggle */}
          <div className="flex justify-center mb-12">
            <button
              onClick={toggleMode}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-slate-100 to-indigo-100 px-10 py-4 text-xl font-bold text-slate-700 shadow-lg transition-all hover:from-slate-200 hover:to-indigo-200 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
            >
              {mode === "login" ? "🆕 Create Account" : "👤 Sign In"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Core Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <span>👤</span> Username
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="input-field text-lg py-5"
                  placeholder="Your unique username"
                />
              </label>
              <label className="block">
                <span className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <span>🔒</span> Password
                </span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="input-field text-lg py-5"
                  placeholder="Secure password"
                />
              </label>
            </div>

            {mode === "register" && (
              <>
                <div className="pt-8 border-t border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <span className="text-indigo-600">📝</span>
                    Profile Details
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2">
                        First Name
                      </span>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="John"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 mb-2">
                        Last Name
                      </span>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Doe"
                      />
                    </label>
                    <label className="block lg:col-span-2">
                      <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <span>📧</span> Email
                      </span>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="john@example.com"
                      />
                    </label>
                    <label className="block lg:col-span-2">
                      <span className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <span>🎭</span> Role
                      </span>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="seller">
                          🛒 Seller - Create & Manage Products
                        </option>
                        <option value="user">👤 Buyer - Shop & Browse</option>
                      </select>
                    </label>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary text-xl py-7 flex items-center gap-3 shadow-2xl"
            >
              {submitting ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                  Processing...
                </>
              ) : mode === "login" ? (
                <>
                  <span>🚀</span>
                  Sign In Securely
                </>
              ) : (
                <>
                  <span>✨</span>
                  Create Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
