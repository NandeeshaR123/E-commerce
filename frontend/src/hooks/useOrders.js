import { useState } from 'react';
import { orderService } from '../services/orderService';
import { isAuthError } from '../utils/api';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.createOrder(orderData);
      setOrders([...orders, data]);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create order';
      if (isAuthError(err)) {
        setError({
          message: errorMessage,
          isAuthError: true,
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrderById(orderId);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch order';
      setError({
        message: errorMessage,
        isAuthError: isAuthError(err),
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    getOrderById,
    setOrders,
  };
};

