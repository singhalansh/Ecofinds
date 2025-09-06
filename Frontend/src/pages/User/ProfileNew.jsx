import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../components/ui/use-toast";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Edit,
    Camera,
    ShoppingBag,
    Heart,
    Package,
    Settings,
    LogOut,
    ArrowLeft,
    Star,
    Eye,
    Trash2,
    Plus,
} from "lucide-react";
import {
    useAddToCartMutation,
    useRemoveFromWishlistMutation,
} from "../../store/api/authApi";

const ProfileNew = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // API mutations
    const [addToCart] = useAddToCartMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    // Local state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.data?.name || "",
        email: user?.data?.email || "",
        phone: user?.data?.addressInfo?.[0]?.phoneNo || "",
        address: user?.data?.addressInfo?.[0]?.address || "",
        city: user?.data?.addressInfo?.[0]?.city || "",
        pinCode: user?.data?.addressInfo?.[0]?.pinCode || "",
    });

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
        navigate("/login", { replace: true });
        return null;
    }

    // Handle edit profile
    const handleEditProfile = () => {
        setIsEditing(true);
    };

    // Handle save profile
    const handleSaveProfile = () => {
        // Here you would typically call an API to update user profile
        toast.success({
            title: "Profile Updated",
            description: "Your profile has been updated successfully",
        });
        setIsEditing(false);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditForm({
            name: user?.data?.name || "",
            email: user?.data?.email || "",
            phone: user?.data?.addressInfo?.[0]?.phoneNo || "",
            address: user?.data?.addressInfo?.[0]?.address || "",
            city: user?.data?.addressInfo?.[0]?.city || "",
            pinCode: user?.data?.addressInfo?.[0]?.pinCode || "",
        });
        setIsEditing(false);
    };

    // Handle add to cart from wishlist
    const handleAddToCart = async (product) => {
        try {
            await addToCart({
                productId: product._id,
                quantity: 1,
                size: "",
                color: "",
            }).unwrap();

            toast.success({
                title: "Added to Cart",
                description: `${product.name} has been added to your cart`,
            });
        } catch (error) {
            toast.error({
                title: "Error",
                description: "Failed to add product to cart",
            });
        }
    };

    // Handle remove from wishlist
    const handleRemoveFromWishlist = async (productId) => {
        try {
            await removeFromWishlist({ productId }).unwrap();

            toast.success({
                title: "Removed from Wishlist",
                description: "Product has been removed from your wishlist",
            });
        } catch (error) {
            toast.error({
                title: "Error",
                description: "Failed to remove product from wishlist",
            });
        }
    };

    // Handle logout
    const handleLogout = () => {
        // Clear user data and redirect to login
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
    };

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
                        My Profile
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100">
                                        <img
                                            src="/images/profile.png"
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <Button
                                        size="sm"
                                        className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>

                                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                    {user?.data?.name}
                                </h2>
                                <Badge variant="secondary" className="mb-4">
                                    {user?.data?.role}
                                </Badge>

                                <div className="flex items-center mb-4">
                                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-gray-700">
                                        4.8
                                    </span>
                                    <span className="mx-1 text-gray-400">
                                        |
                                    </span>
                                    <span className="text-gray-500">
                                        Member since 2021
                                    </span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                    <div className="bg-orange-600 h-2.5 rounded-full w-3/4"></div>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">
                                    75% profile complete
                                </p>

                                <Button
                                    onClick={handleEditProfile}
                                    className="w-full"
                                    size="lg"
                                >
                                    <Edit className="h-5 w-5 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate("/orders")}
                                >
                                    <Package className="h-4 w-4 mr-2" />
                                    View Orders
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate("/wishlist")}
                                >
                                    <Heart className="h-4 w-4 mr-2" />
                                    Wishlist
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate("/cart")}
                                >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Shopping Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate("/vendor")}
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Vendor Dashboard
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Account Details
                                </h3>
                                {!isEditing && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEditProfile}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pin Code
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.pinCode}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        pinCode: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            value={editForm.address}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    address: e.target.value,
                                                })
                                            }
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.city}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    city: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button onClick={handleSaveProfile}>
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <label className="text-sm text-gray-500 block">
                                                Full Name
                                            </label>
                                            <p className="text-gray-800 font-medium">
                                                {user?.data?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <label className="text-sm text-gray-500 block">
                                                Email
                                            </label>
                                            <p className="text-gray-800 font-medium">
                                                {user?.data?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <label className="text-sm text-gray-500 block">
                                                Phone
                                            </label>
                                            <p className="text-gray-800 font-medium">
                                                {user?.data?.addressInfo?.[0]
                                                    ?.phoneNo ||
                                                    "No phone number"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <label className="text-sm text-gray-500 block">
                                                Address
                                            </label>
                                            <p className="text-gray-800 font-medium">
                                                {user?.data?.addressInfo?.[0]
                                                    ?.address || "No address"}
                                            </p>
                                            <p className="text-gray-800 font-medium">
                                                {
                                                    user?.data?.addressInfo?.[0]
                                                        ?.city
                                                }{" "}
                                                {
                                                    user?.data?.addressInfo?.[0]
                                                        ?.pinCode
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Wishlist (
                                    {user?.data?.wishlist?.length || 0})
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate("/wishlist")}
                                >
                                    View All
                                </Button>
                            </div>

                            {user?.data?.wishlist?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {user.data.wishlist
                                        .slice(0, 6)
                                        .map((product, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                                            >
                                                <div className="h-40 mb-3 rounded-lg overflow-hidden">
                                                    <img
                                                        src={
                                                            product?.images?.[0]
                                                                ?.url ||
                                                            "/placeholder-image.jpg"
                                                        }
                                                        alt={product?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                                                    {product?.name}
                                                </h4>
                                                <p className="text-orange-600 font-semibold text-sm mb-3">
                                                    ₹
                                                    {product?.price?.toFixed(2)}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" />
                                                        Add to Cart
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveFromWishlist(
                                                                product._id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Your wishlist is empty
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Start adding products you love to your
                                        wishlist
                                    </p>
                                    <Button
                                        onClick={() => navigate("/products")}
                                    >
                                        Start Shopping
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileNew;
