import api from '../utils/api';

export const addressService = {
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data.addresses || [];
  },

  getAddressById: async (addressId) => {
    const response = await api.get(`/addresses/${addressId}`);
    return response.data.address;
  },

  createAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data.address;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/addresses/${addressId}`, addressData);
    return response.data.address;
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/addresses/${addressId}`);
    return response.data;
  },
};



