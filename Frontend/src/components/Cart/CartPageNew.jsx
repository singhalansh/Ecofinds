import React, { useState, useEffect } from "react";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    Heart,
    ArrowLeft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { toast } from "../ui/use-toast";
import {
    useAddToCartMutation,
    useAddToWishlistMutation,
    useRemoveFromCartMutation,
} from "../../store/api/authApi";

const CartPageNew = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // API mutations
    const [addToCart, { isLoading: isUpdatingCart }] = useAddToCartMutation();
    const [addToWishlist] = useAddToWishlistMutation();
    const [removeFromCart, { isLoading: isRemoving }] =
        useRemoveFromCartMutation();

    // Local state
    const [cartItems, setCartItems] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    // Initialize cart items from user data
    useEffect(() => {
        if (user?.data?.cart) {
            setCartItems(user.data.cart);
        }
    }, [user?.data?.cart]);

    // Calculate totals
    const calculateTotals = () => {
        let subtotal = 0;
        let totalDiscount = 0;
        let totalItems = 0;

        cartItems.forEach((item) => {
            const quantity = item.quantity || 1;
            const price = item.productId?.price || 0;
            const originalPrice = item.productId?.originalPrice || price;

            subtotal += price * quantity;
            totalDiscount += (originalPrice - price) * quantity;
            totalItems += quantity;
        });

        const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        return {
            subtotal,
            totalDiscount,
            shipping,
            tax,
            total,
            totalItems,
        };
    };

    const totals = calculateTotals();

    // Update quantity
    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setIsUpdating(true);
        try {
            const item = cartItems.find((cartItem) => cartItem._id === itemId);
            if (!item) return;

            await addToCart({
                productId: item.productId._id,
                quantity: newQuantity,
                size: item.variant?.size || "",
                color: item.variant?.color || "",
            }).unwrap();

            // Update local state
            setCartItems((prev) =>
                prev.map((cartItem) =>
                    cartItem._id === itemId
                        ? { ...cartItem, quantity: newQuantity }
                        : cartItem
                )
            );

            toast({
                title: "Cart Updated",
                description: "Quantity updated successfully",
                type: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update quantity",
                type: "error",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // Remove item from cart
    const handleRemoveItem = async (itemId) => {
        setIsUpdating(true);
        try {
            await removeFromCart({ productId: itemId }).unwrap();

            setCartItems((prev) => prev.filter((item) => item._id !== itemId));

            toast({
                title: "Item Removed",
                description: "Item has been removed from your cart",
                type: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove item",
                type: "error",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // Move to wishlist
    const handleMoveToWishlist = async (item) => {
        try {
            await addToWishlist({
                productId: item.productId._id,
            }).unwrap();

            await removeFromCart({ productId: item._id }).unwrap();

            setCartItems((prev) =>
                prev.filter((cartItem) => cartItem._id !== item._id)
            );

            toast({
                title: "Moved to Wishlist",
                description: `${item.productId.name} has been moved to your wishlist`,
                type: "success",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to move item to wishlist",
                type: "error",
            });
        }
    };

    // Proceed to checkout
    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please login to proceed to checkout",
                type: "warning",
            });
            return;
        }

        if (cartItems.length === 0) {
            toast({
                title: "Empty Cart",
                description: "Add items to your cart before checkout",
                type: "warning",
            });
            return;
        }

        // Navigate to checkout page
        navigate("/checkout");
    };

    // Continue shopping
    const handleContinueShopping = () => {
        navigate("/products");
    };

    // Empty cart state
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Looks like you haven't added any items to your cart
                            yet
                        </p>
                        <Button onClick={handleContinueShopping} size="lg">
                            Start Shopping
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Shopping Cart ({totals.totalItems} items)
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {cartItems.map((item, index) => (
                                <div
                                    key={item._id}
                                    className={`p-6 ${
                                        index !== cartItems.length - 1
                                            ? "border-b border-gray-200"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={
                                                    item.productId?.images?.[0]
                                                        ?.url ||
                                                    "/placeholder-image.jpg"
                                                }
                                                alt={item.productId?.name}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                                        {item.productId?.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-2">
                                                        {
                                                            item.productId
                                                                ?.category
                                                        }
                                                    </p>

                                                    {/* Variants */}
                                                    {(item.variant?.size ||
                                                        item.variant
                                                            ?.color) && (
                                                        <div className="flex gap-2 mb-3">
                                                            {item.variant
                                                                ?.size && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    Size:{" "}
                                                                    {
                                                                        item
                                                                            .variant
                                                                            .size
                                                                    }
                                                                </Badge>
                                                            )}
                                                            {item.variant
                                                                ?.color && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    Color:{" "}
                                                                    {
                                                                        item
                                                                            .variant
                                                                            .color
                                                                    }
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Price */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-bold text-gray-900">
                                                            ₹
                                                            {item.productId?.price?.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                        {item.productId
                                                            ?.originalPrice &&
                                                            item.productId
                                                                .originalPrice >
                                                                item.productId
                                                                    .price && (
                                                                <>
                                                                    <span className="text-sm text-gray-500 line-through">
                                                                        ₹
                                                                        {item.productId.originalPrice.toFixed(
                                                                            2
                                                                        )}
                                                                    </span>
                                                                    <Badge className="bg-red-100 text-red-700 text-xs">
                                                                        Save ₹
                                                                        {(
                                                                            item
                                                                                .productId
                                                                                .originalPrice -
                                                                            item
                                                                                .productId
                                                                                .price
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </Badge>
                                                                </>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col items-end gap-3">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item._id,
                                                                    item.quantity -
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <=
                                                                    1 ||
                                                                isUpdating
                                                            }
                                                            className="p-2"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item._id,
                                                                    item.quantity +
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            className="p-2"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleMoveToWishlist(
                                                                    item
                                                                )
                                                            }
                                                            className="text-gray-600 hover:text-red-600"
                                                        >
                                                            <Heart className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    item._id
                                                                )
                                                            }
                                                            disabled={
                                                                isRemoving
                                                            }
                                                            className="text-gray-600 hover:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({totals.totalItems} items)
                                    </span>
                                    <span className="font-semibold">
                                        ₹{totals.subtotal.toFixed(2)}
                                    </span>
                                </div>

                                {totals.totalDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-semibold">
                                            -₹{totals.totalDiscount.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Shipping
                                    </span>
                                    <span className="font-semibold">
                                        {totals.shipping === 0
                                            ? "Free"
                                            : `₹${totals.shipping.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold">
                                        ₹{totals.tax.toFixed(2)}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-orange-600">
                                            ₹{totals.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={isUpdating || cartItems.length === 0}
                                className="w-full"
                                size="lg"
                            >
                                Proceed to Checkout
                            </Button>

                            {totals.shipping > 0 && (
                                <p className="text-sm text-gray-600 text-center mt-3">
                                    Add ₹{(1000 - totals.subtotal).toFixed(2)}{" "}
                                    more for free shipping
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPageNew;
