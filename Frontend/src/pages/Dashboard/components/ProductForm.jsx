import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { toast } from "@/components/ui/use-toast";
import { Plus, X, Upload } from "lucide-react";
import { useUserProducts } from "@/contexts/UserProductsContext";

const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Sports",
    "Beauty",
    "Toys",
    "Furniture",
    "Jewelry",
    "Other",
];

const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

const ProductForm = ({ isEdit = false }) => {
    const { toast } = toast();
    const navigate = useNavigate();
    const { id } = useParams();
    const { products, addProduct, updateProduct } = useUserProducts();

    const [isLoading, setIsLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: "",
            category: "",
            stock: 0,
            status: "draft",
        },
    });

    // If in edit mode, load the product data
    useEffect(() => {
        if (isEdit && id) {
            const product = products.find((p) => p._id === id);
            if (product) {
                Object.keys(product).forEach((key) => {
                    if (
                        key !== "_id" &&
                        key !== "__v" &&
                        key !== "createdAt" &&
                        key !== "updatedAt"
                    ) {
                        setValue(key, product[key]);
                    }
                });

                if (product.images && product.images.length > 0) {
                    setImagePreviews(
                        product.images.map((img) => ({
                            url: img.url,
                            name: img.public_id,
                        }))
                    );
                }
            }
        }
    }, [isEdit, id, products, setValue]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [
                    ...prev,
                    { file, url: reader.result },
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const formData = new FormData();

            // Append all form data
            Object.keys(data).forEach((key) => {
                if (key !== "images") {
                    formData.append(key, data[key]);
                }
            });

            // Append new images
            imagePreviews.forEach((img, index) => {
                if (img.file) {
                    formData.append("images", img.file);
                }
            });

            if (isEdit && id) {
                await updateProduct({ id, updates: formData });
                toast({
                    title: "Product updated successfully",
                    description: "Your product has been updated.",
                });
            } else {
                await addProduct(formData);
                toast({
                    title: "Product created successfully",
                    description: "Your product has been added.",
                });
            }

            navigate("/dashboard/products");
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to save product",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isEdit ? "Edit Product" : "Add New Product"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    {...register("name", {
                                        required: "Product name is required",
                                    })}
                                    placeholder="Enter product name"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setValue("category", value, {
                                            shouldValidate: true,
                                        })
                                    }
                                    value={watch("category")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-500">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    {...register("price", {
                                        required: "Price is required",
                                        min: {
                                            value: 0.01,
                                            message:
                                                "Price must be greater than 0",
                                        },
                                    })}
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock *</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    {...register("stock", {
                                        required: "Stock is required",
                                        min: {
                                            value: 0,
                                            message: "Stock cannot be negative",
                                        },
                                    })}
                                    placeholder="0"
                                />
                                {errors.stock && (
                                    <p className="text-sm text-red-500">
                                        {errors.stock.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setValue("status", value, {
                                            shouldValidate: true,
                                        })
                                    }
                                    value={watch("status")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((status) => (
                                            <SelectItem
                                                key={status.value}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-red-500">
                                        {errors.status.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    {...register("description", {
                                        required: "Description is required",
                                    })}
                                    placeholder="Enter product description"
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview.url}
                                            alt={`Preview ${index}`}
                                            className="h-32 w-full object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                <label
                                    htmlFor="product-images"
                                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
                                >
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">
                                        Add Images
                                    </span>
                                    <input
                                        id="product-images"
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            <p className="text-sm text-gray-500">
                                Upload up to 6 images. First image will be used
                                as the main image.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/dashboard/products")}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading
                            ? "Saving..."
                            : isEdit
                            ? "Update Product"
                            : "Add Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
