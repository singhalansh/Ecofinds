import Order from "../models/order.model.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.model.js";
import crypto from "crypto";
import Stripe from "stripe";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import razorpay from "../config/razorpay.js";

// Load environment variables
dotenv.config({
    path: "./.env",
});

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;
// create new order
const createNewOrder = catchAsyncErrors(async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        paymentMethod,
    } = req.body;
    const userId = req.user._id;

    if (
        !shippingInfo ||
        !orderItems ||
        !itemsPrice ||
        !taxPrice ||
        !shippingPrice ||
        !userId
    ) {
        logger.error("Missing required fields for order creation");
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields",
        });
    }

    let totalPrice = 0;
    taxPrice = Number(taxPrice);
    itemsPrice = Number(itemsPrice);
    shippingPrice = Number(shippingPrice);

    taxPriceOfAmount = itemsPrice * (taxPrice / 100); // Assuming 18% tax

    totalPrice += itemsPrice + taxPriceOfAmount + shippingPrice;

    if (paymentMethod === "cod") {
        // Create order with cash on delivery
        const paymentInfo = {
            id: "COD",
            status: "pending",
        };
        const order = await Order.create({
            shippingInfo,
            orderItems,
            user: userId,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
        });

        // Ensure order is created before proceeding
        if (!order) {
            logger.error("Error creating order with cash on delivery");
            return res.status(500).json({
                success: false,
                message: "Error creating order",
            });
        }

        logger.info(`Order created successfully with ID (COD): ${order._id}`);
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    } else if (paymentMethod === "stripe") {
        // Create order with stripe payment

        let paymentInfo = {
            id: "stripe",
            status: "pending",
        };

        const order = await Order.create({
            shippingInfo,
            orderItems,
            user: userId,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        // Ensure order is created before proceeding
        if (!order) {
            logger.error("Error creating order with Stripe payment");
            return res.status(500).json({
                success: false,
                message: "Error creating order",
            });
        }

        const orderId = order._id;
        // Populate order items with product details

        const PopulatedOrder = await Order.findById(orderId).populate(
            "orderItems.product"
        );

        if (!PopulatedOrder) {
            logger.error("Order not found");
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            line_items: PopulatedOrder.orderItems.map((item) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.product.name, // Make sure you populate product details before
                        images: [item.product.image], // Optional: Only if image is public
                    },
                    unit_amount: item.price * 100, // Price per item in paisa
                },
                quantity: item.quantity, // Quantity of this item
            })),

            mode: "payment",

            success_url: `https://yourfrontend.com/order-success/${order._id}`,
            cancel_url: `https://yourfrontend.com/order-cancel/${order._id}`,

            metadata: {
                orderId: order._id.toString(),
                userId: order.user.toString(),
            },

            shipping_address_collection: {
                allowed_countries: ["IN"],
            },
        });

        if (!session.url) {
            logger.error("Error creating Stripe session");
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Error while creating session",
                });
        }

        // Update the order with payment info
        order.paymentInfo.id = session.id;
        order.paymentInfo.status = "pending"; // Set initial status to pending
        await order.save();
        logger.info(`Order created successfully with ID(Stripe): ${order._id}`);
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
            sessionUrl: session.url, // Return the Stripe session URL
        });
    } else if (paymentMethod === "razorpay") {
        // Create order with Razorpay payment
        let paymentInfo = {
            id: "razorpay",
            status: "pending",
        };

        const order = await Order.create({
            shippingInfo,
            orderItems,
            user: userId,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
        });

        // Ensure order is created before proceeding
        if (!order) {
            logger.error("Error creating order with Razorpay payment");
            return res.status(500).json({
                success: false,
                message: "Error creating order",
            });
        }

        // Populate order items with product details
        const PopulatedOrder = await Order.findById(order._id).populate(
            "orderItems.product"
        );

        if (!PopulatedOrder) {
            logger.error("Order not found");
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalPrice * 100), // Amount in paisa
            currency: "INR",
            receipt: `order_${order._id}`,
            notes: {
                orderId: order._id.toString(),
                userId: order.user.toString(),
            },
        });

        if (!razorpayOrder) {
            logger.error("Error creating Razorpay order");
            return res.status(400).json({
                success: false,
                message: "Error while creating Razorpay order",
            });
        }

        // Update the order with Razorpay order ID
        order.paymentInfo.id = razorpayOrder.id;
        order.paymentInfo.status = "pending";
        await order.save();

        logger.info(`Order created successfully with ID (Razorpay): ${order._id}`);

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID,
            },
        });
    }
});

const stripeWebhook = catchAsyncErrors(async (req, res) => {
    let event;

    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        logger.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        logger.info("Checkout session completed event received");

        try {
            const session = event.data.object;

            console.log("session", session);
            if (!session.metadata || !session.metadata.orderId) {
                logger.error("Session metadata or orderId is missing");
                return res
                    .status(400)
                    .json({ message: "Invalid session metadata" });
            }

            let purchasedOrder = await Order.findOne({
                "paymentInfo.id": session.id,
            });

            if (!purchasedOrder) {
                logger.error("Order not found");
                return res.status(404).json({ message: "Order not found" });
            }

            purchasedOrder.paymentInfo.status = "completed";
            purchasedOrder.paidAt = Date.now();

            await purchasedOrder.save();

            logger.info("Order payment completed successfully");

            return res
                .status(200)
                .json({ message: "Order payment completed successfully" });
        } catch (error) {
            console.error("Error handling event:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    res.status(200).send();
});

// Razorpay webhook handler
const razorpayWebhook = catchAsyncErrors(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        logger.error("Missing Razorpay webhook parameters");
        return res.status(400).json({ message: "Invalid webhook data" });
    }

    try {
        // Verify the webhook signature
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            logger.error("Invalid Razorpay webhook signature");
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Find the order
        const order = await Order.findOne({ "paymentInfo.id": razorpay_order_id });

        if (!order) {
            logger.error("Order not found for Razorpay order ID:", razorpay_order_id);
            return res.status(404).json({ message: "Order not found" });
        }

        // Update order payment status
        order.paymentInfo.status = "completed";
        order.paymentInfo.id = razorpay_payment_id; // Update with actual payment ID
        order.paidAt = Date.now();

        await order.save();

        logger.info(`Razorpay payment completed for order: ${order._id}`);

        return res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
        logger.error("Razorpay webhook error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Verify Razorpay payment
const verifyRazorpayPayment = catchAsyncErrors(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Missing payment verification data",
        });
    }

    try {
        // Verify the signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        // Find and update the order
        const order = await Order.findOne({ "paymentInfo.id": razorpay_order_id });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Update order payment status
        order.paymentInfo.status = "completed";
        order.paymentInfo.id = razorpay_payment_id;
        order.paidAt = Date.now();

        await order.save();

        logger.info(`Razorpay payment verified for order: ${order._id}`);

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: order,
        });
    } catch (error) {
        logger.error("Razorpay payment verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
});

// get single order details -- ADMIN
const getSingleOrder = catchAsyncErrors(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: order,
    });
});

// get my orders
const myOrders = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
        return res.status(404).json({
            success: false,
            message: "Orders not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: orders,
    });
});

// get all order details -- ADMIN
const getAllOrders = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find();
    if (!orders) {
        return res.status(404).json({
            success: false,
            message: "Orders not found",
        });
    }

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: orders,
        totalAmount,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save();
}

// update order status - ADMIN
const updateOrderStatus = catchAsyncErrors(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order.orderStatus === "Delivered") {
        return res.status(400).json({
            message: "You have allready delivered the product",
        });
    }

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order,
    });
});

const deleteOrder = catchAsyncErrors(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Orders not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
        data: order,
    });
});

export {
    createNewOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    razorpayWebhook,
    verifyRazorpayPayment,
};
