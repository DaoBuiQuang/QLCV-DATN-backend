import express from "express";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { createApplication_KH, deleteApplication_KH, getAllApplication_KH, getApplicationById_KH, getApplicationsByMaKhachHang_KH, getFullApplicationDetail_KH, getMaKhachHangByMaHoSoVuViec_KH, updateApplication_KH } from "../controllers/KH/donDangKyNhanHieu_KHController.js";
const router = express.Router();

router.post("/application_kh/list",authenticateUser, getAllApplication_KH);
router.post("/application_kh/add",authenticateUser, authorizeRoles("admin", "staff"), createApplication_KH);
router.post("/application_kh/detail",authenticateUser, getApplicationById_KH);
router.post("/application_kh/fulldetail",authenticateUser, getFullApplicationDetail_KH);
router.put("/application_kh/edit",authenticateUser, authorizeRoles("admin", "staff"), updateApplication_KH);
router.post("/application_kh/delete",authenticateUser, authorizeRoles("admin", "staff"), deleteApplication_KH);
router.post("/application_kh/getMaKhachHangByMaHoSoVuViec", getMaKhachHangByMaHoSoVuViec_KH);
router.post("/application_kh/getApplicationByGiayUyQuyenGoc", getApplicationsByMaKhachHang_KH);

export default router;
