import { OrderSuccess } from '../components/checkout/OrderSuccess';

const CheckoutPage = () => {
  return (
    <div className="py-6">
      <OrderSuccess
        orderId="ORD-84920"
        customerName="Boka Mkrtichiani"
        email="boka@example.com"
        shippingAddress="Rustaveli Ave 12, Tbilisi"
        totalPaid={249.99}
      />
    </div>
  );
};

export default CheckoutPage;