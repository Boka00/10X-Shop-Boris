import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { discountPrice, formatPrice } from "../utils/format";
import { useFormik } from "formik";
import type { CheckoutFormValues } from "../types/user";
import { checkoutSchema } from "../schemas/auth.schema";
import OrderSuccess from "../components/checkout/OrderSuccess";


interface SubmittedOrder {
  orderId: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  totalPaid: number;
}


export const CheckoutPage = () => {
 
  const { items, subtotal, totalItems, clearCart} = useCart();
  const { user } = useAuth();

  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);

  function onSubmitFunction(formValues: CheckoutFormValues) {
    
    const generatedId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    setSubmittedOrder({
      orderId: generatedId,
      customerName: formValues.fullname,
      email: formValues.email,
      shippingAddress: `${formValues.address}, ${formValues.city}, ${formValues.zipCode}`,
      totalPaid: subtotal,
    });
    
    clearCart();
  }


  const { values, errors, touched, isValid, dirty,  isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik<CheckoutFormValues>({
    initialValues: {
      fullname: user?.username || "",
      email: user?.username ? `${user.username}@example.com` : "",
      address: "",
      city: "",
      zipCode: 0,
    },
    validationSchema: checkoutSchema,
    onSubmit: onSubmitFunction
  })

  // --- 1. Order Success State (აუცილებლად ცარიელი კალათის შემოწმებამდე!) ---

  if(submittedOrder){
    return (
      <OrderSuccess
        orderId={submittedOrder.orderId}
        customerName={submittedOrder.customerName}
        email={submittedOrder.email}
        shippingAddress={submittedOrder.shippingAddress}
        totalPaid={submittedOrder.totalPaid}
      />
    )
  }

  // --- 2. Empty Cart Guard ---
  
  if(items.length === 0){
    return (
      <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-600">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }
  

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
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
        {/* Left Column (2 cols): Shipping Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 lg:p-8"
        >
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Shipping & Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label htmlFor="fullname" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              {/* TODO: მიაბი formik.getFieldProps('fullName') */}
              <input
                id="fullname"
                type="text"
                value={values.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {/* TODO: გამოაჩინე შეცდომა, თუ formik.touched.fullName && formik.errors.fullName */}
              {touched.fullname && errors.fullname && (
                <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.fullname}
                </p>
              )}
              
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
            
              <input
                id="email"
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

            {/* Street Address */}
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                Street Address
              </label>
    
              <input
                id="address"
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

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                City
              </label>
            
              <input
                id="city"
                type="text"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tbilisi"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {errors.city && touched.city && (
                <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.city}
                </p>
              )}
            </div>

            {/* ZIP / Postal Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700">
                ZIP / Postal Code
              </label>
            
              <input
                id="zipCode"
                type="text"
                value={values.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0108"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
              {errors.zipCode && touched.zipCode && (
                <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.zipCode}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={!isValid || !dirty || isSubmitting}
              className="w-full cursor-pointer rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 *:focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Place Order ({formatPrice(subtotal)})
            </button>
          </div>
        </form>

        {/* Right Column (1 col): Order Items Summary */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Order Summary ({totalItems})
          </h2>

          {/* Items Mini List */}
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1 divide-y divide-slate-100">
            
           {items.map((item)=> (
             <div key={item.productId} className="flex items-center justify-between gap-3 pt-3 first:pt-0">
              <div className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900 line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {formatPrice(discountPrice(item.price, item.discountPercentage) * item.quantity)}
              </span>
            </div>
           ))}
    
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
            <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
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