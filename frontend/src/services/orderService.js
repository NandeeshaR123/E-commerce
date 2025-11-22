import api from '../utils/api';

export const orderService = {
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data.orders || [];
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data.order || response.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.order || response.data;
  },
};

