import express from "express";
import {
    createNewOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    razorpayWebhook,
    verifyRazorpayPayment,
} from "../controllers/order.controller.js";
import { checkAuthenticated } from "../middlewares/authentication.js";

const router = express.Router();

router.route("/order/new").post(checkAuthenticated(), createNewOrder);

router.route("/order/:id").get(getSingleOrder);

router.route("/orders/me").get(myOrders);

router.route("/orders").get(getAllOrders);

router.route("/order/update/:id").put(updateOrderStatus);

router.route("/order/delete/:id").delete(deleteOrder);

// Razorpay routes
router.route("/razorpay/webhook").post(razorpayWebhook);
router.route("/razorpay/verify").post(checkAuthenticated(), verifyRazorpayPayment);

export default router;
