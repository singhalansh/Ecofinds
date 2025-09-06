import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVendor } from "@/contexts/VendorContext";
import { ArrowLeft, Upload, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Sports",
    "Beauty",
    "Accessories",
    "Health",
    "Automotive",
    "Garden",
];

const sampleImages = [
    "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/3685522/pexels-photo-3685522.jpeg?auto=compress&cs=tinysrgb&w=400",
];

const AddProductPage = ({ onBack, editProduct }) => {
    const { addProduct, updateProduct } = useVendor();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        inStock: "",
        images: [{ url: "" }],
        sizes: [],
        colors: [],
        brand: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name || "",
                description: editProduct.description || "",
                price: editProduct.price?.toString() || "",
                originalPrice: editProduct.originalPrice?.toString() || "",
                category: editProduct.category || "",
                inStock: editProduct.inStock?.toString() || "",
                images: editProduct.images || [{ url: "" }],
                sizes: editProduct.sizes || [],
                colors: editProduct.colors || [],
                brand: editProduct.brand || "",
            });
        }
    }, [editProduct]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Product description is required";
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = "Valid price is required";
        }
        if (
            !formData.originalPrice ||
            parseFloat(formData.originalPrice) <= 0
        ) {
            newErrors.originalPrice = "Valid original price is required";
        }
        if (!formData.category) {
            newErrors.category = "Category is required";
        }
        if (!formData.inStock || parseInt(formData.inStock) < 0) {
            newErrors.inStock = "Valid stock quantity is required";
        }
        if (!formData.images[0]?.url?.trim()) {
            newErrors.images = "Product image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const productData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                originalPrice: parseFloat(formData.originalPrice),
                category: formData.category,
                inStock: parseInt(formData.inStock),
                images: formData.images,
                sizes: formData.sizes,
                colors: formData.colors,
                brand: formData.brand,
            };

            if (editProduct) {
                await updateProduct({ id: editProduct._id, ...productData });
                toast.success({
                    title: "Product updated",
                    description: "Your product has been successfully updated.",
                });
            } else {
                await addProduct(productData);
                toast.success({
                    title: "Product added",
                    description: "Your product has been successfully added.",
                });
            }

            onBack();
        } catch (error) {
            toast.error({
                title: "Error",
                description:
                    "There was an error saving your product. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleImageSelect = (imageUrl) => {
        handleInputChange("images", [{ url: imageUrl }]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Products
                </Button>
                <div>
                    <h2 className="text-2xl font-bold">
                        {editProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    <p className="text-muted-foreground">
                        {editProduct
                            ? "Update your product information"
                            : "Create a new product for your store"}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="mb-2">
                                            Product Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter product name"
                                            className={
                                                errors.name
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="description"
                                            className="mb-2"
                                        >
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter product description"
                                            rows={4}
                                            className={
                                                errors.description
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label
                                                htmlFor="price"
                                                className="mb-2"
                                            >
                                                Price (₹)
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0.00"
                                                className={
                                                    errors.price
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.price && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="originalPrice"
                                                className="mb-2"
                                            >
                                                Original Price (₹)
                                            </Label>
                                            <Input
                                                id="originalPrice"
                                                type="number"
                                                step="0.01"
                                                value={formData.originalPrice}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "originalPrice",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0.00"
                                                className={
                                                    errors.originalPrice
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.originalPrice && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.originalPrice}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label
                                                htmlFor="inStock"
                                                className="mb-2"
                                            >
                                                Stock Quantity
                                            </Label>
                                            <Input
                                                id="inStock"
                                                type="number"
                                                value={formData.inStock}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "inStock",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className={
                                                    errors.inStock
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.inStock && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.inStock}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="brand"
                                                className="mb-2"
                                            >
                                                Brand
                                            </Label>
                                            <Input
                                                id="brand"
                                                value={formData.brand}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "brand",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter brand name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label
                                                htmlFor="category"
                                                className="mb-2"
                                            >
                                                Category
                                            </Label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(value) =>
                                                    handleInputChange(
                                                        "category",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        errors.category
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                >
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {category}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.category && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Image Selection */}
                                <div className="space-y-4">
                                    <Label>Product Image</Label>
                                    <div>
                                        <Input
                                            value={
                                                formData.images[0]?.url || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange("images", [
                                                    { url: e.target.value },
                                                ])
                                            }
                                            placeholder="Enter image URL or select from samples below"
                                            className={
                                                errors.images
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.images && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.images}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Or choose from sample images:
                                        </p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {sampleImages.map(
                                                (imageUrl, index) => (
                                                    <div
                                                        key={index}
                                                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                                            formData.images[0]
                                                                ?.url ===
                                                            imageUrl
                                                                ? "border-primary ring-2 ring-primary/20"
                                                                : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                        onClick={() =>
                                                            handleImageSelect(
                                                                imageUrl
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Sample ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-20 object-cover"
                                                        />
                                                        {formData.images[0]
                                                            ?.url ===
                                                            imageUrl && (
                                                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1"
                                    >
                                        {isSubmitting
                                            ? "Saving..."
                                            : editProduct
                                            ? "Update Product"
                                            : "Add Product"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onBack}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div>
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Product Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {formData.images[0]?.url && (
                                    <img
                                        src={formData.images[0].url}
                                        alt="Product preview"
                                        className="w-full h-40 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400";
                                        }}
                                    />
                                )}

                                <div className="space-y-2">
                                    <h3 className="font-semibold">
                                        {formData.name || "Product Name"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formData.description ||
                                            "Product description will appear here..."}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-primary">
                                            ₹{formData.price || "0.00"}
                                        </span>
                                        {formData.category && (
                                            <Badge variant="outline">
                                                {formData.category}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Stock: {formData.inStock || "0"}
                                        </span>
                                        <Badge className="bg-green-100 text-green-800">
                                            Active
                                        </Badge>
                                    </div>

                                    {formData.originalPrice &&
                                        formData.originalPrice !==
                                            formData.price && (
                                            <div className="text-sm text-muted-foreground">
                                                Original:{" "}
                                                <span className="line-through">
                                                    ₹{formData.originalPrice}
                                                </span>
                                            </div>
                                        )}

                                    {formData.brand && (
                                        <div className="text-sm text-muted-foreground">
                                            Brand: {formData.brand}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;
