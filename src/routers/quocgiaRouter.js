import express from "express";
import { addCountry, getCountries, getCountryById, updateCountry, deleteCountry } from "../controllers/quocgiaController.js";

const router = express.Router();

// Lấy danh sách quốc gia (có thể tìm theo tên nếu có search trong body)
router.post("/country/list", getCountries);

// Lấy thông tin quốc gia theo ID từ body
router.post("/country/detail", getCountryById);

// Thêm quốc gia
router.post("/country/add", addCountry);

// Cập nhật thông tin quốc gia
router.put("/country/update", updateCountry);

// Xóa quốc gia
router.delete("/country/delete", deleteCountry);

export default router;
