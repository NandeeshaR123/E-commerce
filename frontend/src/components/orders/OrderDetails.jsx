import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import Loading from '../shared/Loading';
import Error from '../shared/Error';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, loading, error } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return <Error message={error || 'Order not found'} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="mb-4 text-primary-600 hover:text-primary-700"
      >
        ← Back to Orders
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-2 md:mt-0 ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4 mb-6">
            {order.products && order.products.length > 0 ? (
              order.products.map((item, index) => {
                const product = item.product?._id ? item.product : item.product;
                const productId = product?._id || product;
                const productName = product?.name || 'Product';
                const productPrice = product?.price || 0;
                const productImage = product?.image || 'https://via.placeholder.com/100';
                const quantity = item.quantity || 1;

                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <Link to={`/products/${productId}`}>
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition"
                      />
                    </Link>

                    <div className="flex-1">
                      <Link
                        to={`/products/${productId}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition"
                      >
                        {productName}
                      </Link>
                      <p className="text-gray-600 text-sm">
                        Quantity: {quantity} × ${productPrice.toFixed(2)}
                      </p>
                    </div>

                    <p className="text-lg font-bold text-gray-900">
                      ${(productPrice * quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">No products in this order</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">
                ${(order.totalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

