import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import CartItem from './CartItem';
import Loading from '../shared/Loading';
import Error from '../shared/Error';

const Cart = () => {
  const { isAuthenticated, user } = useAuth();
  const { cart, loading, error, fetchCart, removeFromCart } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [enrichedCart, setEnrichedCart] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Enrich cart items with product details
  useEffect(() => {
    if (cart && products.length > 0) {
      const enrichedItems = cart.items?.map((item) => {
        const productId = item.productId?._id || item.productId;
        const product = products.find((p) => p._id === productId);
        return {
          ...item,
          productId: product || { _id: productId },
        };
      });
      setEnrichedCart({ ...cart, items: enrichedItems });
    } else if (cart) {
      setEnrichedCart(cart);
    }
  }, [cart, products]);

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setPlacingOrder(true);
      const orderData = {
        userId: user.id,
        items: cart.items.map((item) => {
          const productId = item.productId?._id || item.productId;
          return {
            product: productId,
            quantity: item.quantity,
          };
        }),
        totalAmount: cart.totalPrice || 0,
      };

      await createOrder(orderData);
      alert('Order placed successfully!');
      fetchCart(); // Refresh cart
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchCart} />;
  }

  const displayCart = enrichedCart || cart;

  if (!displayCart || !displayCart.items || displayCart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {displayCart.items.map((item) => {
              const productId = item.productId?._id || item.productId;
              return (
                <CartItem
                  key={productId}
                  item={item}
                  onRemove={handleRemoveItem}
                />
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${(displayCart.totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${(displayCart.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={placingOrder || orderLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50"
            >
              {placingOrder || orderLoading ? 'Placing Order...' : 'Checkout'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

