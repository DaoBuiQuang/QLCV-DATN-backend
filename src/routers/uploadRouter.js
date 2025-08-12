// routes/upload.js
import express from "express";
import { uploadExcel, uploadExcelDoiTac, uploadExcelHoSoVuViec, importHSVVFromDB } from "../controllers/uploadController.js";


const router = express.Router();
router.post("/upload-excel", uploadExcel);
router.post("/import-doitac", uploadExcelDoiTac);
router.post("/import-hsvv", uploadExcelHoSoVuViec);
router.post("/import-ho-so-db", importHSVVFromDB);
export default router;
