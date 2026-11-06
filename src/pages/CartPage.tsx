import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { CartItemRow } from "../components/cart/CartItemRow";

export const CartPage = () => {
  const {items, totalItems, subtotal, setQuantity, removeItem, clearCart} = useCart();

  // --- 1. Empty Cart State UI ---
  
  if(items.length === 0){
   return (
    <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
        🛒
      </div>
      <h1 className="text-xl font-bold text-slate-900">Your cart is empty.</h1>
      <p className="mt-2 text-sm text-slate-600">
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
 
  const originalTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSaved = Number((originalTotal - subtotal).toFixed(2));

  return (
    <div className="space-y-6 py-4">
      {/* Page Header & Clear Cart Button */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-600">
            {totalItems} items in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="self-start cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:self-auto"
        >
          Clear cart
        </button>
      </div>

      {/* Main Grid: Items List (Left 2 cols) + Order Summary (Right 1 col) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        {/* Left Column: Cart Items */}
        <div className="space-y-4 lg:col-span-2">
       
              {items.map((item) => (
                <CartItemRow key={item.productId}
                  item={item}
                  onUpdateQuantity={setQuantity}
                  onRemove={removeItem}/>
              ) )}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          <div className="space-y-3 border-b border-slate-100 pb-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Original price ({totalItems} items)</span>
              <span>{formatPrice(originalTotal)}</span>
            </div>

            {totalSaved > 0 && (
              <div className="flex justify-between font-medium text-emerald-600">
                <span>Discount savings</span>
                <span>-{formatPrice(totalSaved)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
          </div>

          {/* Final Subtotal */}
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-slate-900">Subtotal</span>
            <span className="text-2xl font-extrabold text-slate-900">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Action Links */}
          <div className="space-y-3 pt-2">
            <Link
              to="/checkout"
              className="block w-full rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Proceed to checkout
            </Link>

            <Link
              to="/"
              className="block w-full rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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