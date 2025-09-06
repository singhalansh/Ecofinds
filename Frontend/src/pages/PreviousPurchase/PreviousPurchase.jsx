import React, { useState } from "react";
import { useGetMyOrdersQuery } from "../../store/api/orderApi";
import { useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
    Package,
    Calendar,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    ArrowLeft,
    Eye,
    Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PreviousPurchase = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const {
        data: ordersData,
        isLoading,
        isError,
        error,
    } = useGetMyOrdersQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [selectedOrder, setSelectedOrder] = useState(null);

    // Get status color and icon
    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case "processing":
                return {
                    color: "bg-blue-100 text-blue-700",
                    icon: Clock,
                    label: "Processing",
                };
            case "shipped":
                return {
                    color: "bg-purple-100 text-purple-700",
                    icon: Truck,
                    label: "Shipped",
                };
            case "delivered":
                return {
                    color: "bg-green-100 text-green-700",
                    icon: CheckCircle,
                    label: "Delivered",
                };
            case "cancelled":
                return {
                    color: "bg-red-100 text-red-700",
                    icon: XCircle,
                    label: "Cancelled",
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-700",
                    icon: Clock,
                    label: "Pending",
                };
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-lg p-6 shadow-sm border"
                                >
                                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Error Loading Orders
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error?.data?.message ||
                            "Failed to load your order history"}
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Login Required
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Please login to view your order history
                    </p>
                    <Button onClick={() => navigate("/login")}>Login</Button>
                </div>
            </div>
        );
    }

    const orders = ordersData?.data || [];

    // Empty orders state
    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            No Orders Yet
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            You haven't made any purchases yet. Start shopping
                            to see your orders here!
                        </p>
                        <Button onClick={() => navigate("/products")} size="lg">
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
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Order History ({orders.length} orders)
                    </h1>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map((order) => {
                        const statusInfo = getStatusInfo(order.orderStatus);
                        const StatusIcon = statusInfo.icon;

                        return (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Order #
                                                    {order._id
                                                        .slice(-8)
                                                        .toUpperCase()}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Placed on{" "}
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </p>
                                            </div>
                                            <Badge className={statusInfo.color}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {statusInfo.label}
                                            </Badge>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                ₹{order.totalAmount?.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.orderItems?.length}{" "}
                                                item(s)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {order.orderItems?.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <img
                                                        src={
                                                            item.productId
                                                                ?.images?.[0]
                                                                ?.url ||
                                                            "/placeholder-image.jpg"
                                                        }
                                                        alt={
                                                            item.productId?.name
                                                        }
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate">
                                                            {
                                                                item.productId
                                                                    ?.name
                                                            }
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Qty: {item.quantity}
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            ₹
                                                            {item.price?.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Order Details */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Shipping Address */}
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-1">
                                                    Shipping Address
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {order.shippingInfo
                                                        ?.address ||
                                                        "No address provided"}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {order.shippingInfo?.city},{" "}
                                                    {order.shippingInfo?.state}{" "}
                                                    {
                                                        order.shippingInfo
                                                            ?.pinCode
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div className="flex items-start gap-3">
                                            <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-1">
                                                    Payment Method
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {order.paymentInfo
                                                        ?.paymentMethod ||
                                                        "Not specified"}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {order.paymentInfo
                                                        ?.status ||
                                                        "Payment status unknown"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Actions */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setSelectedOrder(order)
                                                    }
                                                    className="w-full"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                                {order.orderStatus ===
                                                    "delivered" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Rate & Review
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Order Details
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    ×
                                </Button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order Summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        Order ID
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        #
                                        {selectedOrder._id
                                            .slice(-8)
                                            .toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        Order Date
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(selectedOrder.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        Total Amount
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        ₹{selectedOrder.totalAmount?.toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        Status
                                    </h3>
                                    <Badge
                                        className={
                                            getStatusInfo(
                                                selectedOrder.orderStatus
                                            ).color
                                        }
                                    >
                                        {
                                            getStatusInfo(
                                                selectedOrder.orderStatus
                                            ).label
                                        }
                                    </Badge>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">
                                    Items
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems?.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <img
                                                    src={
                                                        item.productId
                                                            ?.images?.[0]
                                                            ?.url ||
                                                        "/placeholder-image.jpg"
                                                    }
                                                    alt={item.productId?.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">
                                                        {item.productId?.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-medium text-gray-900">
                                                    ₹{item.price?.toFixed(2)}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviousPurchase;
