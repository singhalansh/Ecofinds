import express from "express";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getAllReviews,
    deleteProductReview,
    getPaginatedProducts,
} from "../controllers/product.controller.js";
import {
    authorizeRoles,
    checkAuthenticated,
} from "../middlewares/authentication.js";
import upload from "../middlewares/multer.js";
import preferenceAuth from "../middlewares/preferenceAuth.js";

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/product").get(getPaginatedProducts);

router
    .route("/product/new")
    .post(upload.fields([{ name: "image", maxCount: 5 }]), createProduct);

router
    .route("/product/:id")
    .put(updateProduct)
    .delete(deleteProduct)
    .get(preferenceAuth(), getProductDetails);

router.route("/review").put(checkAuthenticated(), createProductReview);

router.route("/reviews/:id").get(getAllReviews);

router.route("/review/delete/:id").delete(deleteProductReview);

export default router;
