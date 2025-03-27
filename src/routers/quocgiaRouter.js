import express from "express";
import { addCountry, getCountries, getCountryById, updateCountry, deleteCountry } from "../controllers/quocgiaController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lấy danh sách quốc gia (có thể tìm theo tên nếu có search trong body)
router.post("/country/list",authenticateUser, getCountries);
router.post("/country/detail",authenticateUser, getCountryById);
router.post("/country/add",authenticateUser, addCountry);
router.put("/country/update",authenticateUser, updateCountry);
router.delete("/country/delete",authenticateUser, deleteCountry);

export default router;
