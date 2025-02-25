import express from "express";
import { addProductController, getProducts } from "../controllers/productController.js";


const router = express.Router();

router.get("/products", getProducts); // Lấy danh sách sản phẩm
// router.get("/products/:id", getProductByIdController); // Lấy sản phẩm theo ID
router.post("/products", addProductController); // Thêm sản phẩm
// router.put("/products/:id", updateProduct); // Cập nhật sản phẩm
// router.delete("/products/:id", deleteProduct); // Xóa sản phẩm

export default router;
