import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format";

interface OrderSuccessProps {
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
    <div className="mx-auto my-12 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
        ✓
      </div>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Thank you! Your order has been placed.
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Thank you, <span className="font-semibold text-slate-800">{customerName}</span>! A confirmation has been sent to{" "}
        <span className="font-semibold text-slate-800">{email}</span>.
      </p>

      <div className="mt-6 space-y-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Order number:</span>
          <span className="font-bold text-slate-900">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Shipping to:</span>
          <span className="font-medium text-slate-800">{shippingAddress}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2">
          <span className="font-semibold text-slate-700">Total paid:</span>
          <span className="font-extrabold text-indigo-600">
            {formatPrice(totalPaid)}
          </span>
        </div>
      </div>

      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Continue shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;