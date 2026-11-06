import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { discountPrice, formatPrice } from "../utils/format";
import { useFormik } from "formik";
import type { CheckoutFormValues } from "../types/user";
import type { ShippingInfo } from "../types/order";
import { checkoutSchema } from "../schemas/auth.schema";
import OrderSuccess from "../components/checkout/OrderSuccess";

interface SubmittedOrder {
  orderId: string;
  shipping: ShippingInfo;
  totalPaid: number;
}

export const CheckoutPage = () => {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { user } = useAuth();

  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);

  function onSubmitFunction(formValues: CheckoutFormValues) {
    const generatedId = `10X-${String(Math.floor(10000 + Math.random() * 90000))}`;

    const shippingInfo: ShippingInfo = {
      fullName: formValues.fullname.trim(),
      email: formValues.email.trim(),
      address: formValues.address.trim(),
      city: formValues.city.trim(),
      postalCode: formValues.zipCode.trim(),
    };

    setSubmittedOrder({
      orderId: generatedId,
      shipping: shippingInfo,
      totalPaid: subtotal,
    });

    clearCart();
  }

  const {
    values,
    errors,
    isValid,
    dirty,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<CheckoutFormValues>({
    initialValues: {
      fullname: user?.username || "",
      email: user?.username ? `${user.username}@example.com` : "",
      address: "",
      city: "",
      zipCode: "",
    },
    validationSchema: checkoutSchema,
    onSubmit: onSubmitFunction,
  });

  if (submittedOrder) {
    const { shipping } = submittedOrder;
    return (
      <OrderSuccess
        orderId={submittedOrder.orderId}
        customerName={shipping.fullName}
        email={shipping.email}
        shippingAddress={`${shipping.address}, ${shipping.city}${shipping.postalCode ? `, ${shipping.postalCode}` : ""}`}
        totalPaid={submittedOrder.totalPaid}
      />
    );
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
        >
          ← Back to cart
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 lg:p-8"
        >
          <h2 className="border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
            Shipping & Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="fullname" className="block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={values.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {touched.fullname && errors.fullname && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.fullname}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="12 Rustaveli Ave, Apt 4"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {touched.address && errors.address && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tbilisi"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {touched.city && errors.city && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700">
                Postal code
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={values.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0108"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {touched.zipCode && errors.zipCode && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.zipCode}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              className="w-full cursor-pointer rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place order ({formatPrice(subtotal)})
            </button>
          </div>
        </form>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Order Summary ({totalItems})
          </h2>

          <div className="max-h-80 divide-y divide-slate-100 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 pt-3 first:pt-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-cover"
                  />
                  <div>
                    <p className="line-clamp-1 text-xs font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {formatPrice(
                    discountPrice(item.price, item.discountPercentage) *
                      item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-slate-100 pt-2">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-xl font-extrabold text-slate-900">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;