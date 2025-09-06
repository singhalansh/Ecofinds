import React from "react";
import ProductDetail from "../../components/Product/ProductDetailNew";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../store/api/productApi";
import Navbar from "../../components/Home/Navbar";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: productData,
        isLoading,
        isError,
        error,
    } = useGetProductDetailsQuery(id);

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                                    <div className="flex gap-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-20 h-20 bg-gray-200 rounded-lg"
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                    <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Product Not Found
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error?.data?.message ||
                                "The product you're looking for doesn't exist."}
                        </p>
                        <Button
                            onClick={() => navigate("/products")}
                            className="mr-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/")}>
                            Go Home
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    if (!productData?.data) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            No Product Data
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Unable to load product information.
                        </p>
                        <Button onClick={() => navigate("/products")}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <ProductDetail product={productData.data} />
        </>
    );
};

export default Product;
