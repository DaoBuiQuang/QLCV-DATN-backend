// routes/upload.js
import express from "express";
import { uploadExcel, uploadExcelDoiTac, uploadExcelHoSoVuViec, importHSVVFromDB, importHSVVCamFromDB } from "../controllers/uploadController.js";


const router = express.Router();
router.post("/upload-excel", uploadExcel);
router.post("/import-doitac", uploadExcelDoiTac);
router.post("/import-hsvv", uploadExcelHoSoVuViec);
router.post("/import-ho-so-db", importHSVVFromDB);
router.post("/import-ho-so-db_cam_donmoi", importHSVVCamFromDB);
export default router;
