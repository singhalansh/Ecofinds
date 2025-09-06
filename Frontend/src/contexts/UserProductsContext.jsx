import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import {
    useGetUserProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from "../store/api/userProductsApi";
import { toast } from "@/components/ui/use-toast";

const UserProductsContext = createContext();

export const UserProductsProvider = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    // Fetch user's products
    const {
        data: userProducts,
        isLoading,
        error,
        refetch,
    } = useGetUserProductsQuery(undefined, {
        skip: !user?.data?._id,
    });

    const [addProductMutation] = useAddProductMutation();
    const [updateProductMutation] = useUpdateProductMutation();
    const [deleteProductMutation] = useDeleteProductMutation();

    const products = userProducts?.products || [];

    const addProduct = async (productData) => {
        try {
            const result = await addProductMutation(productData).unwrap();
            toast.success({
                title: "Success",
                description: "Product added successfully",
            });
            await refetch();
            return { success: true, data: result };
        } catch (error) {
            toast.error({
                title: "Error",
                description: error.data?.message || "Failed to add product",
            });
            return {
                success: false,
                error: error.data?.message || "Failed to add product",
            };
        }
    };

    const updateProduct = async ({ id, ...updates }) => {
        try {
            const result = await updateProductMutation({
                id,
                updates,
            }).unwrap();
            toast.success({
                title: "Success",
                description: "Product updated successfully",
            });
            await refetch();
            return { success: true, data: result };
        } catch (error) {
            toast.error({
                title: "Error",
                description: error.data?.message || "Failed to update product",
            });
            return {
                success: false,
                error: error.data?.message || "Failed to update product",
            };
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await deleteProductMutation(productId).unwrap();
            toast.success({
                title: "Success",
                description: "Product deleted successfully",
            });
            await refetch();
            return { success: true };
        } catch (error) {
            toast.error({
                title: "Error",
                description: error.data?.message || "Failed to delete product",
            });
            return {
                success: false,
                error: error.data?.message || "Failed to delete product",
            };
        }
    };

    return (
        <UserProductsContext.Provider
            value={{
                products,
                isLoading,
                error,
                addProduct,
                updateProduct,
                deleteProduct,
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
        throw new Error(
            "useUserProducts must be used within a UserProductsProvider"
        );
    }
    return context;
};
