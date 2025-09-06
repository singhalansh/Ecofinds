import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

// Load environment variables
dotenv.config({ path: "./.env" });

const sampleProducts = [
    {
        name: "Eco-Friendly Bamboo Water Bottle",
        description: "Sustainable bamboo water bottle with stainless steel interior. Perfect for daily use and environmentally conscious lifestyle.",
        price: 1299,
        originalPrice: 1599,
        ratings: 4.5,
        category: "Eco Products",
        inStock: 50,
        images: [
            { url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500" }
        ],
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        name: "Organic Cotton Tote Bag",
        description: "100% organic cotton tote bag. Perfect for shopping, beach trips, or daily errands. Reusable and sustainable.",
        price: 599,
        originalPrice: 799,
        ratings: 4.3,
        category: "Eco Products",
        inStock: 100,
        images: [
            { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" }
        ],
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        name: "Solar-Powered LED Lantern",
        description: "Portable solar-powered LED lantern. Perfect for camping, emergencies, or outdoor activities. Eco-friendly and energy-efficient.",
        price: 2499,
        originalPrice: 2999,
        ratings: 4.7,
        category: "Solar Products",
        inStock: 25,
        images: [
            { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500" }
        ],
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        name: "Biodegradable Phone Case",
        description: "Plant-based biodegradable phone case. Made from renewable materials, fully compostable after use.",
        price: 899,
        originalPrice: 1199,
        ratings: 4.2,
        category: "Eco Products",
        inStock: 75,
        images: [
            { url: "https://images.unsplash.com/photo-1511707171637-5c897bf679aa?w=500" }
        ],
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        name: "Recycled Paper Notebook Set",
        description: "Set of 3 notebooks made from 100% recycled paper. Perfect for students, professionals, or anyone who loves writing.",
        price: 399,
        originalPrice: 599,
        ratings: 4.4,
        category: "Eco Products",
        inStock: 200,
        images: [
            { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500" }
        ],
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        name: "Compostable Cutlery Set",
        description: "Complete set of compostable cutlery made from cornstarch. Perfect for parties, picnics, or takeaway meals.",
        price: 299,
        originalPrice: 399,
        ratings: 4.1,
        category: "Eco Products",
        inStock: 150,
        images: [
            { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500" }
        ],
        createdBy: new mongoose.Types.ObjectId()
    }
];

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ Connected to MongoDB");

        // Clear existing products (optional)
        await Product.deleteMany({});
        console.log("🗑️ Cleared existing products");

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);
        console.log(`✅ Successfully added ${products.length} products`);

        // Display added products
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ₹${product.price}`);
        });

        console.log("\n🎉 Sample products added successfully!");
        console.log("You can now test the Razorpay integration with these products.");

    } catch (error) {
        console.error("❌ Error seeding products:", error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
        process.exit(0);
    }
};

// Run the seeding function
seedProducts();
