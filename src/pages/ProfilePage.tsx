import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { STORAGE_KEYS } from "../models/StorageService";
import { getSavedOrders } from "../models/Order";
import type { ProfileFormValues } from "../types/user";

export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const [values, setValues] = useState<ProfileFormValues>(() => {
    const parts = user.username.trim().split(" ");
    return {
      firstName: user.firstName ?? parts[0] ?? "",
      lastName: user.lastName ?? parts.slice(1).join(" ") ?? "",
      email: user.email ?? (user.username ? `${user.username}@example.com` : ""),
      phone: user.phone ?? "",
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormValues, string>>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [ordersCount, setOrdersCount] = useState<number>(() => getSavedOrders().length);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ProfileFormValues, string>> = {};

    if (values.firstName.trim().length < 2) {
      nextErrors.firstName = "First name must be at least 2 characters";
    }
    if (values.lastName.trim().length < 2) {
      nextErrors.lastName = "Last name must be at least 2 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim() || !emailRegex.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }
    if (values.phone.trim().length > 0) {
      const phoneRegex = /^\+?[\d\s]{9,15}$/;
      const digitsOnly = values.phone.replace(/\D/g, "");
      if (
        !phoneRegex.test(values.phone.trim()) ||
        digitsOnly.length < 9 ||
        digitsOnly.length > 15
      ) {
        nextErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setStatusMessage(null);
    if (!validate()) return;

    updateProfile(values);
    setStatusMessage("Profile updated ✓");
  };

  const handleClearLocalData = (): void => {
    clearCart();
    try {
      localStorage.removeItem(STORAGE_KEYS.cart);
      localStorage.removeItem(STORAGE_KEYS.orders);
      localStorage.removeItem(STORAGE_KEYS.reviews);
    } catch (error) {
      console.error("Failed to clear local data:", error);
    }
    setOrdersCount(0);
    setStatusMessage("Local cart, orders, and reviews cleared ✓");
  };

  const handleLogout = (): void => {
    logout();
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Profile
        </h1>
        <p className="text-sm text-slate-600">
          Manage your personal details and local application data.
        </p>
      </div>

      {statusMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {statusMessage}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
              {user.username.at(0)?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {user.username}
              </h2>
              <p className="text-xs text-slate-500">
                Total Orders Placed: {ordersCount}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-700"
              >
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={values.firstName}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-slate-700"
              >
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={values.lastName}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, email: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700"
            >
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.phone && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save changes
          </button>
        </form>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
          <button
            type="button"
            onClick={handleClearLocalData}
            className="flex-1 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Clear local data
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;