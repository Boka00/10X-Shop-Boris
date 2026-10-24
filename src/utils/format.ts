
// ითვლის ფასდაკლებულ ფასს და ამრგვალებს 2 ათწილადამდე
export function discountPrice(price: number, discountPercentage: number):number {
    if (discountPercentage < 1) return price;
    const discounted = price * (1 - discountPercentage / 100);
    return Number(discounted.toFixed(2));
}


export function formatPrice(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
}