import express from "express";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register); // Đăng ký người dùng
router.post("/login", login); // Đăng nhập người dùng
router.post("/logout", logout); // Đăng xuất người dùng

export default router;
