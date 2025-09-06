import React, { createContext, useContext, useMemo } from "react";
import { useUserProducts } from "./UserProductsContext";

const VendorContext = createContext(undefined);

export const useVendor = () => {
    const context = useContext(VendorContext);
    if (!context) {
        throw new Error("useVendor must be used within a VendorProvider");
    }
    return context;
};

// Generate analytics from real product data
const generateAnalytics = (products) => {
    const totalProducts = products.length;
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const totalRevenue = products.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const conversionRate = 12.4; // This could be calculated from real data

    const topSellingProduct =
        [...products].sort((a, b) => (b.sales || 0) - (a.sales || 0))[0]
            ?.name || "N/A";

    const salesTrend = [
        { month: "Jan", sales: 145, revenue: 28400 },
        { month: "Feb", sales: 167, revenue: 32100 },
        { month: "Mar", sales: 189, revenue: 35800 },
        { month: "Apr", sales: 223, revenue: 42300 },
        { month: "May", sales: 198, revenue: 39600 },
        { month: "Jun", sales: 234, revenue: 45200 },
        { month: "Jul", sales: 256, revenue: 48900 },
        { month: "Aug", sales: 289, revenue: 52400 },
        { month: "Sep", sales: 267, revenue: 49800 },
        { month: "Oct", sales: 312, revenue: 58100 },
        { month: "Nov", sales: 298, revenue: 55300 },
        { month: "Dec", sales: 334, revenue: 62800 },
    ];

    const categories = [...new Set(products.map((p) => p.category))];
    const categoryDistribution = categories.map((category) => {
        const count = products.filter((p) => p.category === category).length;
        const percentage = (count / totalProducts) * 100;
        return { category, count, percentage };
    });

    const revenueByCategory = categories.map((category) => {
        const revenue = products
            .filter((p) => p.category === category)
            .reduce((sum, p) => sum + (p.revenue || 0), 0);
        return { category, revenue };
    });

    return {
        totalProducts,
        totalSales,
        totalRevenue,
        averageOrderValue,
        conversionRate,
        topSellingProduct,
        salesTrend,
        categoryDistribution,
        revenueByCategory,
    };
};

export const VendorProvider = ({ children }) => {
    const {
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        isLoading,
        error,
    } = useUserProducts();

    const analytics = useMemo(() => {
        return generateAnalytics(products);
    }, [products]);

    const value = {
        products,
        analytics,
        addProduct,
        updateProduct,
        deleteProduct,
        isLoading,
        error,
    };

    return (
        <VendorContext.Provider value={value}>
            {children}
        </VendorContext.Provider>
    );
};
