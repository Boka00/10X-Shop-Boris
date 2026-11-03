import { Link } from "react-router-dom";
import type { CartItem } from "../../types/cart";
import { discountPrice, formatPrice } from "../../utils/format";

interface CartItemRowProps {
    item: CartItem;
    onUpdateQuantity: (productId: number, qty: number) => void;
    onRemove: (productId: number) => void
}

export const CartItemRow = ({item, onUpdateQuantity, onRemove}: CartItemRowProps) => {

  const unitPrice = discountPrice(item.price, item.discountPercentage);
  const hasDiscount = (item.discountPercentage >= 1);
  const lineTotal = unitPrice * item.quantity;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Image & Product Info */}
      <div className="flex items-center gap-4">
       
        <Link
          to={`/products/${item.productId}`}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
        >
         
          <img
            src={item.thumbnail}
            alt={item.title}
            width="80"
            height="80"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </Link>

        <div className="space-y-1">
         
          <Link
            to={`/products/${item.productId}`}
            className="text-base font-semibold text-slate-900 transition-colors hover:text-indigo-600 line-clamp-1"
          >
            {item.title}
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-700">
              {formatPrice(unitPrice)}
            </span>
          
           {hasDiscount && (
             <span className="text-xs text-slate-400 line-through">
              {formatPrice(item.price)}
            </span>
           )}
          </div>

          <p className="text-xs text-slate-400">
            Max available: {item.stock}
          </p>
        </div>
      </div>

      {/* Right: Quantity Stepper, Line Total & Remove */}
      <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
        {/* Quantity Stepper */}
        <div className="flex items-center rounded-lg border border-slate-300 bg-white">
        
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="cursor-pointer px-2.5 py-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            -
          </button>

          <span className="w-8 text-center text-sm font-semibold text-slate-900">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="cursor-pointer px-2.5 py-1 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>

        {/* Line Total Price */}
        <div className="w-24 text-right">
          <span className="text-base font-bold text-slate-900">
            {formatPrice(lineTotal)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Remove item"
        >
          Remove
        </button>
      </div>
    </div>
  );
};