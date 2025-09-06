import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './EcommerceContext';
import { useGetUserProductsQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../store/api/authApi';

const UserProductsContext = createContext();

export const UserProductsProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's products
  const { data: userProducts, refetch } = useGetUserProductsQuery(undefined, {
    skip: !user?._id,
  });

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (userProducts) {
      setProducts(userProducts.products || []);
      setIsLoading(false);
    }
  }, [userProducts]);

  const addNewProduct = async (productData) => {
    try {
      const result = await addProduct(productData).unwrap();
      await refetch();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to add product' };
    }
  };

  const editProduct = async ({ id, ...updates }) => {
    try {
      const result = await updateProduct({ id, updates }).unwrap();
      await refetch();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to update product' };
    }
  };

  const removeProduct = async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      await refetch();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to delete product' };
    }
  };

  return (
    <UserProductsContext.Provider
      value={{
        products,
        isLoading,
        error,
        addProduct: addNewProduct,
        updateProduct: editProduct,
        deleteProduct: removeProduct,
        refreshProducts: refetch,
      }}
    >
      {children}
    </UserProductsContext.Provider>
  );
};

export const useUserProducts = () => {
  const context = useContext(UserProductsContext);
  if (!context) {
    throw new Error('useUserProducts must be used within a UserProductsProvider');
  }
  return context;
};
