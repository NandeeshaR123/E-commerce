import api from '../utils/api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data.cart || response.data;
  },

  removeFromCart: async (productId) => {
    // Backend uses req.body.productId even though it's in params
    const response = await api.delete(`/cart/remove/${productId}`, {
      data: { productId }
    });
    return response.data.cart || response.data;
  },
};

