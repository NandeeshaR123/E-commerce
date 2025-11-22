import { useState, useEffect } from 'react';
import { addressService } from '../services/addressService';
import { isAuthError } from '../utils/api';

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.getAddresses();
      setAddresses(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch addresses';
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

  const createAddress = async (addressData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.createAddress(addressData);
      setAddresses([...addresses, data]);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create address';
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

  const updateAddress = async (addressId, addressData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.updateAddress(addressId, addressData);
      setAddresses(addresses.map(addr => addr._id === addressId ? data : addr));
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update address';
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

  const deleteAddress = async (addressId) => {
    try {
      setLoading(true);
      setError(null);
      await addressService.deleteAddress(addressId);
      setAddresses(addresses.filter(addr => addr._id !== addressId));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete address';
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

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};



