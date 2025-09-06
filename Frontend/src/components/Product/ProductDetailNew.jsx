import React, { useState } from "react";
import {
    Star,
    Heart,
    ShoppingCart,
    Truck,
    Shield,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    Check,
    Share2,
    MessageCircle,
    ThumbsUp,
    Eye,
    Package,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { toast } from "../ui/use-toast";
import {
    useAddToCartMutation,
    useAddToWishlistMutation,
} from "../../store/api/authApi";

const ProductDetailNew = ({ product }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // State management
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(
        product?.colors?.[0] || ""
    );
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [isWishlisted, setIsWishlisted] = useState(false);

    // API mutations
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
    const [addToWishlist, { isLoading: isAddingToWishlist }] =
        useAddToWishlistMutation();

    // Check if product is in cart or wishlist
    const isInCart = user?.data?.cart?.some(
        (item) => item.productId._id === product._id
    );
    const isInWishlist = user?.data?.wishlist?.some(
        (item) => item._id === product._id
    );

    // Product data
    const images = product?.images || [];
    const discount = product?.originalPrice
        ? Math.round(
              ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
          )
        : 0;

    // Utility functions
    const getColorStyle = (color) => {
        const colorMap = {
            white: "#ffffff",
            black: "#000000",
            blue: "#3b82f6",
            red: "#ef4444",
            gray: "#6b7280",
            brown: "#92400e",
            tan: "#d2b48c",
            silver: "#c0c0c0",
            gold: "#ffd700",
            "rose gold": "#e8b4b8",
            tortoise: "#8b4513",
        };
        return colorMap[color?.toLowerCase()] || "#9ca3af";
    };

    const renderStars = (rating, size = "md") => {
        const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`${sizeClass} ${
                            i < Math.floor(rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    // Event handlers
    const handleQuantityChange = (change) => {
        setQuantity(Math.max(1, quantity + change));
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please login to add items to cart",
                type: "warning",
            });
            return;
        }

        try {
            await addToCart({
                productId: product._id,
                quantity: quantity,
                size: selectedSize,
                color: selectedColor,
            }).unwrap();

            toast({
                title: "Added to Cart",
                description: `${product.name} has been added to your cart`,
                type: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add product to cart",
                type: "error",
            });
        }
    };

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please login to add items to wishlist",
                type: "warning",
            });
            return;
        }

        try {
            await addToWishlist({
                productId: product._id,
            }).unwrap();

            setIsWishlisted(!isWishlisted);
            toast({
                title: isWishlisted
                    ? "Removed from Wishlist"
                    : "Added to Wishlist",
                description: isWishlisted
                    ? `${product.name} has been removed from your wishlist`
                    : `${product.name} has been added to your wishlist`,
                type: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update wishlist",
                type: "error",
            });
        }
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please login to purchase items",
                type: "warning",
            });
            return;
        }
        // Navigate to checkout with this product
        navigate("/cart");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link Copied",
                description: "Product link has been copied to clipboard",
                type: "success",
            });
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Product Not Found
                    </h2>
                    <p className="text-gray-600">
                        The product you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                    <span>Back to Products</span>
                </Button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={
                                    images[selectedImage]?.url ||
                                    "/placeholder-image.jpg"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImage === index
                                                ? "border-blue-500 ring-2 ring-blue-200"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-sm">
                                    {product.brand}
                                </Badge>
                                {product.featured && (
                                    <Badge className="bg-purple-100 text-purple-700">
                                        Featured
                                    </Badge>
                                )}
                                {discount > 0 && (
                                    <Badge className="bg-red-100 text-red-700">
                                        {discount}% OFF
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                {renderStars(product.ratings)}
                                <span className="text-sm text-gray-600">
                                    {product.ratings} (
                                    {product.numOfReviews || 0} reviews)
                                </span>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{product.price?.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">
                                            ₹{product.originalPrice.toFixed(2)}
                                        </span>
                                        <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                            Save ₹
                                            {(
                                                product.originalPrice -
                                                product.price
                                            ).toFixed(2)}
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-6">
                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                                        Color:{" "}
                                        <span className="font-normal">
                                            {selectedColor}
                                        </span>
                                    </h3>
                                    <div className="flex gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() =>
                                                    setSelectedColor(color)
                                                }
                                                className={`w-10 h-10 rounded-full border-2 transition-all ${
                                                    selectedColor === color
                                                        ? "border-blue-500 ring-2 ring-blue-200"
                                                        : "border-gray-300 hover:border-gray-400"
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        getColorStyle(color),
                                                }}
                                                title={color}
                                            >
                                                {color.toLowerCase() ===
                                                    "white" && (
                                                    <div className="w-full h-full rounded-full border border-gray-200" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                                        Size:{" "}
                                        <span className="font-normal">
                                            {selectedSize}
                                        </span>
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() =>
                                                    setSelectedSize(size)
                                                }
                                                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                                                    selectedSize === size
                                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                                        : "border-gray-300 hover:border-gray-400 text-gray-700"
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">
                                    Quantity
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleQuantityChange(-1)
                                            }
                                            disabled={quantity <= 1}
                                            className="p-2"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="px-4 py-2 font-medium">
                                            {quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleQuantityChange(1)
                                            }
                                            className="p-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {product.inStock > 0
                                            ? `${product.inStock} in stock`
                                            : "Out of Stock"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={
                                        !product.inStock ||
                                        isInCart ||
                                        isAddingToCart
                                    }
                                    className="flex-1"
                                    size="lg"
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    {isInCart
                                        ? "Already in Cart"
                                        : "Add to Cart"}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleAddToWishlist}
                                    disabled={isAddingToWishlist}
                                    className={`${
                                        isInWishlist || isWishlisted
                                            ? "border-red-300 bg-red-50 text-red-600"
                                            : ""
                                    }`}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${
                                            isInWishlist || isWishlisted
                                                ? "fill-current"
                                                : ""
                                        }`}
                                    />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleShare}
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>

                            <Button
                                onClick={handleBuyNow}
                                disabled={!product.inStock}
                                className="w-full"
                                size="lg"
                                variant="default"
                            >
                                Buy Now
                            </Button>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Truck className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Free Shipping
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Estimated delivery: 3-5 business days
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <RotateCcw className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Easy Returns
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        30-day return policy
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Secure Payment
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Your payment information is protected
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {["description", "specifications", "reviews"].map(
                                (tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        {tab.charAt(0).toUpperCase() +
                                            tab.slice(1)}
                                    </button>
                                )
                            )}
                        </nav>
                    </div>

                    <div className="py-8">
                        {activeTab === "description" && (
                            <div className="prose max-w-none">
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {product.description}
                                </p>
                                {product.features && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Key Features
                                        </h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {product.features.map(
                                                (feature, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                        <span className="text-gray-700">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-900">
                                            Brand
                                        </span>
                                        <span className="text-gray-600">
                                            {product.brand}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-900">
                                            Category
                                        </span>
                                        <span className="text-gray-600">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-900">
                                            Stock
                                        </span>
                                        <span className="text-gray-600">
                                            {product.inStock} units
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-gray-200">
                                        <span className="font-medium text-gray-900">
                                            Rating
                                        </span>
                                        <span className="text-gray-600">
                                            {product.ratings}/5
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Customer Reviews
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            {renderStars(product.ratings)}
                                            <span className="text-sm text-gray-600">
                                                Based on{" "}
                                                {product.numOfReviews || 0}{" "}
                                                reviews
                                            </span>
                                        </div>
                                    </div>
                                    <Button>Write a Review</Button>
                                </div>

                                <div className="space-y-6">
                                    {product.reviews &&
                                    product.reviews.length > 0 ? (
                                        product.reviews.map((review, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg p-6 shadow-sm border"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {review.user?.name?.charAt(
                                                                0
                                                            ) || "U"}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">
                                                                    {review.user
                                                                        ?.name ||
                                                                        "Anonymous"}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {renderStars(
                                                                        review.rating,
                                                                        "sm"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 mb-4">
                                                            {review.comment}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                                                                <ThumbsUp className="h-4 w-4" />
                                                                Helpful
                                                            </button>
                                                            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                                                                <MessageCircle className="h-4 w-4" />
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No reviews yet
                                            </h3>
                                            <p className="text-gray-600">
                                                Be the first to review this
                                                product!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailNew;
