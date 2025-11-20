import { useEffect, useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import OrderItem from './OrderItem';
import Loading from '../shared/Loading';
import Error from '../shared/Error';

const Orders = () => {
  const { orders, loading, error, setOrders } = useOrders();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    // Note: Backend doesn't have getAllOrders endpoint
    // Orders are stored in state when created
    // You may need to add this endpoint to your backend
    setFetching(false);
  }, []);

  if (loading || fetching) {
    return <Loading />;
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const isAuthError = typeof error === 'object' && error.isAuthError;
    return (
      <div className="container mx-auto px-4 py-8">
        <Error 
          message={errorMessage}
          isAuthError={isAuthError}
        />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Orders</h1>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">You have no orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderItem key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;

