// routes/upload.js
import express from "express";
import { uploadExcel, uploadExcelDoiTac, uploadExcelHoSoVuViec } from "../controllers/uploadController.js";


const router = express.Router();
router.post("/upload-excel", uploadExcel);
router.post("/import-doitac", uploadExcelDoiTac);
router.post("/import-hsvv", uploadExcelHoSoVuViec);
export default router;
