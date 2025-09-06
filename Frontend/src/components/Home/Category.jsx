import React from "react";
import { useGetAllProductsQuery } from "../../store/api/productApi";
import { Link } from "react-router-dom";

const Category = () => {
    const { data: productsData, isLoading, isError } = useGetAllProductsQuery();

    // Generate categories from actual products
    const categories = React.useMemo(() => {
        if (!productsData?.data) return [];

        const categoryMap = {};
        productsData.data.forEach((product) => {
            if (product.category) {
                if (!categoryMap[product.category]) {
                    categoryMap[product.category] = {
                        name: product.category,
                        count: 0,
                        image:
                            product.images?.[0]?.url ||
                            "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800",
                    };
                }
                categoryMap[product.category].count++;
            }
        });

        return Object.values(categoryMap).slice(0, 4); // Show top 4 categories
    }, [productsData]);

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Loading categories...
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-md animate-pulse"
                            >
                                <div className="aspect-square bg-gray-200"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !categories.length) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            No categories available at the moment
                        </p>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our diverse range of products across multiple
                        categories
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            to={`/products?category=${encodeURIComponent(
                                category.name
                            )}`}
                            className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden block"
                        >
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-xl font-bold mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-200">
                                    {category.count} items
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Category;
