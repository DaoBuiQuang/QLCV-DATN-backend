import express from "express";
import { login, register } from "../controllers/authController.js";


const router = express.Router();

router.post("/register", register); // Lấy danh sách sản phẩm
// router.get("/products/:id", getProductByIdController); // Lấy sản phẩm theo ID
router.post("/login", login); // Thêm sản phẩm
// router.put("/products/:id", updateProduct); // Cập nhật sản phẩm
// router.delete("/products/:id", deleteProduct); // Xóa sản phẩm

export default router;
