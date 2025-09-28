import express from "express";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { createApplication_SD_VN, deleteApplication_SD_VN, getAllApplication_SD_VN, getApplicationById_SD_VN, updateApplication_SD_VN } from "../controllers/NH_VN_SD/donSuaDoi_NH_VNController.js";
import { getFullApplicationDetail_GH_VN } from "../controllers/NH_VN_GH/giaHanNhanHieu_VNController.js";

const router = express.Router();

router.post("/application_sd_nh_vn/list",authenticateUser, authorizeRoles("admin", "staff"), getAllApplication_SD_VN);
router.post("/application_sd_nh_vn/add",authenticateUser, authorizeRoles("admin", "staff"), createApplication_SD_VN);
router.post("/application_sd_nh_vn/detail",authenticateUser, authorizeRoles("admin", "staff"), getApplicationById_SD_VN);
router.post("/application_sd_nh_vn/fulldetail",authenticateUser,authorizeRoles("admin", "staff"), getFullApplicationDetail_GH_VN);
router.put("/application_sd_nh_vn/edit",authenticateUser, authorizeRoles("admin", "staff"), updateApplication_SD_VN);
router.post("/application_sd_nh_vn/delete",authenticateUser, authorizeRoles("admin", "staff"), deleteApplication_SD_VN);
//router.post("/application_gh_vn/getMaKhachHangByMaHoSoVuViec", getMaKhachHangByMaHoSoVuViec_KH);
//router.post("/application_gh_vn/getApplicationByGiayUyQuyenGoc", getApplicationsByMaKhachHang_KH);
export default router;
