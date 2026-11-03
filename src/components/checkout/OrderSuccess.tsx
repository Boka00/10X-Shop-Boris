import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format";

interface OrderSuccessProps {
    orderId: string
    customerName: string;
    email: string;
    shippingAddress: string;
    totalPaid: number;
}

export const OrderSuccess = ({orderId, customerName, email, shippingAddress, totalPaid}: OrderSuccessProps) => {
  return (
    <div className="mx-auto my-10 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      {/* Success Checkmark Icon */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600 ring-8 ring-emerald-50/50">
        ✓
      </div>

      <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wider text-indigo-600 uppercase">
        Order #{orderId}
      </span>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">
        Thank you for your order, {customerName}!
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        We have sent an order confirmation receipt to{' '}
        <span className="font-semibold text-slate-800">{email}</span>.
      </p>

      {/* Order Details Box */}
      <div className="mt-6 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-sm">
        <div className="flex justify-between border-b border-slate-200/70 pb-2.5">
          <span className="text-slate-500">Shipping to</span>
          <span className="font-medium text-slate-800 text-right">
            {shippingAddress}
          </span>
        </div>

        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Total amount paid</span>
          <span className="text-base font-extrabold text-emerald-600">
            {formatPrice(totalPaid)}
          </span>
        </div>
      </div>

      {/* Back to Catalog Button */}
      <div className="mt-8">
        <Link
          to="/"
          className="inline-block w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;