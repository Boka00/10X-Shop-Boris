import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { CartItemRow } from "../components/cart/CartItemRow";

export const CartPage = () => {
  const {
    items,
    totalItems,
    subtotal,
    discount,
    shippingCost,
    total,
    promoCode,
    applyPromo,
    removePromo,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState<string>("");
  const [promoError, setPromoError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Your cart is empty.
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const handleApplyPromo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPromoError(null);
    const ok = applyPromo(promoInput);
    if (!ok) {
      setPromoError("Invalid promo code");
    } else {
      setPromoInput("");
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="self-start cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onUpdateQuantity={setQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Order Summary
          </h2>

          {/* Promo Code Form (P4.4) */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label htmlFor="promoCode" className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              Promo code (try 10X10)
            </label>
            <div className="flex gap-2">
              <input
                id="promoCode"
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="10X10"
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-xs font-medium text-red-600">{promoError}</p>
            )}
          </form>

          <div className="space-y-3 border-b border-slate-100 pb-4 text-sm dark:border-slate-800">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {promoCode && discount > 0 && (
              <div className="flex items-center justify-between font-medium text-emerald-600">
                <span>
                  Discount ({promoCode} −10%){" "}
                  <button
                    type="button"
                    onClick={removePromo}
                    className="ml-1 cursor-pointer text-xs text-red-500 underline"
                  >
                    Remove
                  </button>
                </span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping</span>
              <span className="font-medium text-emerald-600">
                {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              Total
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatPrice(total)}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/checkout"
              className="block w-full rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Proceed to checkout
            </Link>

            <Link
              to="/"
              className="block w-full rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;