import { useCart } from '../context/CartContext';
import { CartItemRow } from '../components/cart/CartItemRow';

const CartPage = () => {
  const { items, setQuantity, removeItem } = useCart();

  return (
    <div className="space-y-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Shopping Cart (Test View)</h1>
      {items.map((item) => (
        <CartItemRow
          key={item.productId}
          item={item}
          onUpdateQuantity={setQuantity}
          onRemove={removeItem}
        />
      ))}
    </div>
  );
};

export default CartPage;