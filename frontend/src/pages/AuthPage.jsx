import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialAuth = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "seller",
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
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Authentication
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {mode === "login" ? "Login" : "Register"}
          </h1>
        </div>
        <button
          onClick={toggleMode}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          {mode === "login" ? "Switch to register" : "Switch to login"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        {mode === "register" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  First Name
                </span>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Last Name
                </span>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="seller">Seller</option>
                <option value="user">User</option>
              </select>
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
}
