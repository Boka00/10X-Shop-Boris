import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderStatus, getSavedOrders } from "../models/Order";
import type { Order, OrderStatus } from "../types/order";
import { discountPrice, formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import NotFoundPage from "./NotFound";
import type { Product } from "../types/product";

function getStatusBadgeClasses(status: OrderStatus): string {
  switch (status) {
    case "Processing":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Shipped":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
}

export function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // ინიციალიზაცია პირდაპირ ფუნქციით — იცილებს ზედმეტ ეფექტებს
  const [orders] = useState<Order[]>(() => getSavedOrders());
  const [now, setNow] = useState<Date>(() => new Date());
  const [feedback, setFeedback] = useState<string | null>(null);

  // P6.2 - ყოველ 30 წამში სტატუსების გადათვლა cleanup-ით unmount-ზე
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // თუ /orders/:id მარშრუტზე ვართ — ვაჩვენებთ დეტალურ გვერდს (P6.3)
  if (id !== undefined) {
    const foundOrder = orders.find(
      (o) => String(o.id) === id || o.number === id
    );

    if (!foundOrder) {
      return <NotFoundPage />;
    }

    const currentStatus = getOrderStatus(foundOrder, now);
    const steps: OrderStatus[] = ["Processing", "Shipped", "Delivered"];
    const currentStepIdx = steps.indexOf(currentStatus);

    const handleReorder = (): void => {
      foundOrder.items.forEach((item) => {
        const syntheticProduct: Product = {
          id: item.productId,
          title: item.title,
          description: "",
          category: "",
          price: item.price,
          discountPercentage: item.discountPercentage,
          rating: 5,
          stock: item.stock,
          thumbnail: item.thumbnail,
          images: [item.thumbnail],
        };
        addItem(syntheticProduct, item.quantity);
      });
      setFeedback("Items added to cart ✓");
      navigate("/cart");
    };

    return (
      <div className="mx-auto max-w-4xl space-y-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to orders
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Order #{foundOrder.number}
            </h1>
            <p className="text-sm text-slate-500">
              Placed on {new Date(foundOrder.placedAt).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(
              currentStatus
            )}`}
          >
            {currentStatus}
          </span>
        </div>

        {feedback && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedback}
          </div>
        )}

        {/* Status Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Order Status Timeline
          </h2>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIdx;
              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : "○"}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isCompleted ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 flex-1 ${
                        index < currentStepIdx
                          ? "bg-emerald-500"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Ordered Items</h2>
          <div className="divide-y divide-slate-100">
            {foundOrder.items.map((item) => {
              const unit = discountPrice(item.price, item.discountPercentage);
              const lineTotal = Math.round(unit * item.quantity * 100) / 100;
              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-lg border border-slate-200 object-cover bg-slate-50"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.productId}`}
                        className="truncate block text-sm font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {item.quantity} × {formatPrice(unit)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {formatPrice(lineTotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping & Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 text-sm">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Shipping Address
            </h2>
            <p className="font-medium text-slate-800">
              {foundOrder.shipping.fullName}
            </p>
            <p className="text-slate-600">{foundOrder.shipping.email}</p>
            <p className="text-slate-600">
              {foundOrder.shipping.address}, {foundOrder.shipping.city}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3 text-sm">
            <h2 className="text-base font-bold text-slate-900">Order Summary</h2>
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatPrice(foundOrder.subtotal)}</span>
            </div>
            {foundOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>−{formatPrice(foundOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>
                {foundOrder.shippingCost === 0
                  ? "Free"
                  : formatPrice(foundOrder.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(foundOrder.total)}</span>
            </div>

            <button
              type="button"
              onClick={handleReorder}
              className="mt-4 w-full cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Reorder
            </button>
          </div>
        </div>
      </div>
    );
  }

  // P6.1 - ცარიელი სია ზუსტი ტექსტებით
  if (orders.length === 0) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          You have no orders yet.
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          When you place an order at checkout, it will appear here.
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

  // P6.1 - შეკვეთების სია
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Orders
        </h1>
        <p className="text-sm text-slate-600">
          Track your active orders and view past purchases.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = getOrderStatus(order, now);
          const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-base font-bold text-slate-900">
                    #{order.number}
                  </span>
                  <p className="text-xs text-slate-500">
                    {new Date(order.placedAt).toLocaleDateString()} ·{" "}
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                  <span className="text-lg font-extrabold text-slate-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default OrderPage;