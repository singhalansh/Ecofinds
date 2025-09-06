import { Heart, ShoppingCart, Star } from "lucide-react";
import React from "react";
import { useGetAllProductsQuery } from "../../store/api/productApi";
import { Link } from "react-router-dom";

const FeatureProducts = () => {
    const { data: productsData, isLoading, isError } = useGetAllProductsQuery();

    // Get featured products or first 4 products if no featured ones
    const featuredProducts = React.useMemo(() => {
        if (!productsData?.data) return [];

        const featured = productsData.data.filter(
            (product) => product.featured
        );
        if (featured.length >= 4) {
            return featured.slice(0, 4);
        }

        // If less than 4 featured products, fill with regular products
        const regular = productsData.data.filter(
            (product) => !product.featured
        );
        return [...featured, ...regular].slice(0, 4);
    }, [productsData]);

    if (isLoading) {
        return (
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Loading amazing products for you...
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-md animate-pulse"
                            >
                                <div className="aspect-square bg-gray-200"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !featuredProducts.length) {
        return (
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            No products available at the moment
                        </p>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Featured Products
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Hand-picked products with amazing deals just for you
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden block"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={
                                        product.images?.[0]?.url ||
                                        product.image ||
                                        "/placeholder-image.jpg"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <button className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors duration-200">
                                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                                </button>
                                {product.originalPrice &&
                                    product.originalPrice > product.price && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            SALE
                                        </div>
                                    )}
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-200">
                                    {product.name}
                                </h3>
                                <div className="flex items-center mb-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i <
                                                    Math.floor(
                                                        product.ratings || 0
                                                    )
                                                        ? "text-yellow-400 fill-current"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2">
                                        ({product.numOfReviews || 0})
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl font-bold text-gray-900">
                                            ₹{product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <button className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-colors duration-200">
                                        <ShoppingCart className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureProducts;
