import { Link } from 'react-router-dom';

const OrderItem = ({ order }) => {
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
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Order #{order._id.slice(-8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-600">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-2 mb-4">
          {order.products && order.products.length > 0 ? (
            order.products.map((item, index) => {
              const product = item.product?._id ? item.product : item.product;
              const productName = product?.name || 'Product';
              const productPrice = product?.price || 0;
              const quantity = item.quantity || 1;

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {product?.image && (
                      <img
                        src={product.image}
                        alt={productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <Link
                        to={`/products/${product?._id || product}`}
                        className="text-gray-900 hover:text-primary-600 transition font-medium"
                      >
                        {productName}
                      </Link>
                      <p className="text-sm text-gray-600">
                        Quantity: {quantity} × ${productPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    ${(productPrice * quantity).toFixed(2)}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600">No products in this order</p>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">
              ${(order.totalAmount || 0).toFixed(2)}
            </p>
          </div>
          <Link
            to={`/orders/${order._id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;

