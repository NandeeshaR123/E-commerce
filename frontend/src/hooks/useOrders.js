import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { isAuthError } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const useOrders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      setOrders(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
      if (isAuthError(err)) {
        setError({
          message: errorMessage,
          isAuthError: true,
        });
      } else {
        setError({ message: errorMessage });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
    fetchOrders,
    createOrder,
    getOrderById,
    setOrders,
  };
};

