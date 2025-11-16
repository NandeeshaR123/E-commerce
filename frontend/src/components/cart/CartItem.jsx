import { Link } from 'react-router-dom';

const CartItem = ({ item, onRemove }) => {
  const product = item.productId._id ? item.productId : item.productId;
  const productId = product._id || product;
  const productName = product.name || 'Product';
  const productPrice = product.price || 0;
  const productImage = product.image || 'https://via.placeholder.com/100';
  const quantity = item.quantity || 1;

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200 last:border-b-0">
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
        <p className="text-gray-600 text-sm">${productPrice.toFixed(2)} each</p>
      </div>

      <div className="text-center">
        <p className="text-gray-700 font-semibold">Quantity: {quantity}</p>
        <p className="text-gray-600 text-sm">
          ${(productPrice * quantity).toFixed(2)}
        </p>
      </div>

      <button
        onClick={() => onRemove(productId)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition text-sm"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;

