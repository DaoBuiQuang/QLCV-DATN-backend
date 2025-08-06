import express from "express";
import { createApplication, deleteApplication, getAllApplication, getApplicationById, getApplicationsByMaKhachHang, getFullApplicationDetail, getMaKhachHangByMaHoSoVuViec, updateApplication } from "../controllers/donDangKyController.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/application/list",authenticateUser, getAllApplication);
router.post("/application/add",authenticateUser, authorizeRoles("admin", "staff"), createApplication);
router.post("/application/detail",authenticateUser, getApplicationById);
router.post("/application/fulldetail",authenticateUser, getFullApplicationDetail);
router.put("/application/edit",authenticateUser, authorizeRoles("admin", "staff"), updateApplication);
router.post("/application/delete",authenticateUser, authorizeRoles("admin", "staff"), deleteApplication);
router.post("/application/getMaKhachHangByMaHoSoVuViec", getMaKhachHangByMaHoSoVuViec);
router.post("/application/getApplicationByGiayUyQuyenGoc", getApplicationsByMaKhachHang);
export default router;
