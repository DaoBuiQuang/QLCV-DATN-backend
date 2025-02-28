import express from "express";
import { addCourse, getCourses } from "../controllers/courseController.js";


const router = express.Router();

router.get("/courses", getCourses); // Lấy danh sách sản phẩm
// router.get("/products/:id", getProductByIdController); // Lấy sản phẩm theo ID
router.post("/course", addCourse); // Thêm sản phẩm
// router.put("/products/:id", updateProduct); // Cập nhật sản phẩm
// router.delete("/products/:id", deleteProduct); // Xóa sản phẩm

export default router;
