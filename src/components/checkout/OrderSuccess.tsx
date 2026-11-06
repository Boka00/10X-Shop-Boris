import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format";

export interface OrderSuccessProps {
  orderId: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  totalPaid: number;
}

export const OrderSuccess = ({
  orderId,
  customerName,
  email,
  shippingAddress,
  totalPaid,
}: OrderSuccessProps) => {
  return (
    <div className="mx-auto my-12 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Thank you! Your order has been placed.
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Order <span className="font-semibold text-indigo-600">#{orderId}</span>{" "}
        for <span className="font-semibold">{customerName}</span> ({email}) is now being processed.
      </p>

      <div className="mt-6 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-sm dark:border-slate-800 dark:bg-slate-800/60">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Shipping to:</span>
          <span className="font-medium text-slate-900 dark:text-slate-200">{shippingAddress}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
          <span className="font-bold text-slate-900 dark:text-white">Total Paid:</span>
          <span className="text-lg font-extrabold text-emerald-600">
            {formatPrice(totalPaid)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/orders"
          className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          View Orders
        </Link>
        <Link
          to="/"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;