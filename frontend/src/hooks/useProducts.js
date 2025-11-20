import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { isAuthError } from '../utils/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch products';
      setError({
        message: errorMessage,
        isAuthError: isAuthError(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(products.map((p) => (p._id === id ? updatedProduct : p)));
      return updatedProduct;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      if (isAuthError(err)) {
        const errorMessage = err.response?.data?.message || 'Your session has expired. Please login again.';
        setError({
          message: errorMessage,
          isAuthError: true,
        });
      }
      throw err.response?.data || err;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

