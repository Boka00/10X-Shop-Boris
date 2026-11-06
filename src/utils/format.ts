export function discountPrice(price: number, discountPercentage: number): number {
  if (discountPercentage <= 0) return Math.round(price * 100) / 100;
  const discounted = price * (1 - discountPercentage / 100);
  return Math.round(discounted * 100) / 100;
}

export const discountedPrice = discountPrice;

export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}