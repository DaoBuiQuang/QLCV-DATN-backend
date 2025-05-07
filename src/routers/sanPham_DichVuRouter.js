import express from "express";
import { addSanPhamDichVu, deleteSanPhamDichVu, getAllSanPhamDichVu, getSanPhamDichVuById, updateSanPhamDichVu } from "../controllers/sanPham_DichVuController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/productsandservices/list", getAllSanPhamDichVu);
router.post("/productsandservices/detail",authenticateUser, getSanPhamDichVuById);
router.post("/productsandservices/add",authenticateUser, addSanPhamDichVu);
router.put("/productsandservices/edit",authenticateUser, updateSanPhamDichVu);
router.post("/productsandservices/delete",authenticateUser, deleteSanPhamDichVu);

export default router;
