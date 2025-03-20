import express from "express";
import { addCustomer, getCustomers } from "../controllers/customerController.js";


const router = express.Router();

router.get("/customers", getCustomers); // Lấy danh ssách sản phẩm
// router.get("/products/:id", getProductByIdController); // Lấy sản phẩm theo ID
router.post("/customer", addCustomer); // Thêm sản phẩm
// router.put("/products/:id", updateProduct); // Cập nhật sản phẩm
// router.delete("/products/:id", deleteProduct); // Xóa sản phẩm

export default router;
