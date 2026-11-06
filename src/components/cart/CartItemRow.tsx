import { Link } from "react-router-dom";
import type { CartItem } from "../../types/cart";
import { discountPrice, formatPrice } from "../../utils/format";

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItemRow = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) => {
  const unitPrice = discountPrice(item.price, item.discountPercentage);
  const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <Link to={`/products/${item.productId}`} className="shrink-0">
          <img
            src={item.thumbnail}
            alt={item.title}
            width={80}
            height={80}
            loading="lazy"
            className="h-20 w-20 rounded-xl border border-slate-200 bg-slate-50 object-cover dark:border-slate-700 dark:bg-slate-800"
          />
        </Link>
        <div className="space-y-1">
          <Link
            to={`/products/${item.productId}`}
            className="text-base font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
          >
            {item.title}
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatPrice(unitPrice)}
            </span>
            {item.discountPercentage >= 1 && (
              <span className="line-through">{formatPrice(item.price)}</span>
            )}
            <span>· Stock: {item.stock}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            aria-label={`Decrease quantity of ${item.title}`}
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="cursor-pointer px-3 py-1.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label={`Increase quantity of ${item.title}`}
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="cursor-pointer px-3 py-1.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            +
          </button>
        </div>

        <div className="min-w-24 text-right">
          <p className="text-base font-extrabold text-slate-900 dark:text-white">
            {formatPrice(lineTotal)}
          </p>
        </div>

        <button
          type="button"
          aria-label={`Remove ${item.title} from cart`}
          onClick={() => onRemove(item.productId)}
          className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-slate-700 dark:hover:bg-red-950/40"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;