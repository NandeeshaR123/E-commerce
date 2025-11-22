import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { useAddresses } from '../../hooks/useAddresses';
import CartItem from './CartItem';
import Loading from '../shared/Loading';
import Error from '../shared/Error';
import AddressForm from '../addresses/AddressForm';

const Cart = () => {
  const { isAuthenticated, user } = useAuth();
  const { cart, loading, error, fetchCart, removeFromCart } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();
  const { products } = useProducts();
  const { addresses, loading: addressesLoading, fetchAddresses, createAddress } = useAddresses();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [enrichedCart, setEnrichedCart] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchAddresses();
    }
  }, [isAuthenticated]);

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      }
    }
  }, [addresses, selectedAddressId]);

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
      const totalPrice = calculateTotalPrice(enrichedItems);
      setEnrichedCart({ ...cart, items: enrichedItems, totalPrice });
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

    if (!selectedAddressId) {
      alert('Please select or add a delivery address');
      return;
    }

    try {
      setPlacingOrder(true);
      const orderData = {
        products: cart.items.map((item) => {
          const productId = item.productId?._id || item.productId;
          return {
            product: productId,
            quantity: item.quantity,
          };
        }),
        totalAmount: displayCart.totalPrice || 0 || 0,
        addressId: selectedAddressId,
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

  const handleAddAddress = async (formData) => {
    try {
      setFormLoading(true);
      const newAddress = await createAddress(formData);
      setSelectedAddressId(newAddress._id);
      setShowAddressForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add address');
    } finally {
      setFormLoading(false);
    }
  };

  const calculateTotalPrice = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const isAuthError = typeof error === 'object' && error.isAuthError;
    return (
      <div className="container mx-auto px-4 py-8">
        <Error 
          message={errorMessage} 
          onRetry={!isAuthError ? fetchCart : null}
          isAuthError={isAuthError}
        />
      </div>
    );
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
          <div className="space-y-6">
            {/* Address Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
              
              {addressesLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading addresses...</p>
                </div>
              ) : showAddressForm ? (
                <div>
                  <AddressForm
                    onSubmit={handleAddAddress}
                    onCancel={() => setShowAddressForm(false)}
                    loading={formLoading}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">No addresses found</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <>
                      <select
                        value={selectedAddressId || ''}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                      >
                        <option value="">Select an address</option>
                        {addresses.map((address) => (
                          <option key={address._id} value={address._id}>
                            {address.fullName} - {address.addressLine1}, {address.city}
                            {address.isDefault && ' (Default)'}
                          </option>
                        ))}
                      </select>
                      {selectedAddressId && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          {(() => {
                            const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
                            if (!selectedAddress) return null;
                            return (
                              <div className="text-sm text-gray-700">
                                <p className="font-semibold">{selectedAddress.fullName}</p>
                                <p>{selectedAddress.phone}</p>
                                <p>{selectedAddress.addressLine1}</p>
                                {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                                <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                                <p>{selectedAddress.country}</p>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      <button
                        onClick={() => navigate('/addresses')}
                        className="w-full mt-2 text-primary-600 hover:text-primary-700 text-sm font-semibold"
                      >
                        Manage Addresses
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
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
                disabled={placingOrder || orderLoading || !selectedAddressId}
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
    </div>
  );
};

export default Cart;

