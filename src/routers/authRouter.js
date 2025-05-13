import express from "express";
import { register, login, logout, changePassword, resetPassword } from "../controllers/authController.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register",authenticateUser,authorizeRoles("admin"), register); 
router.post("/login", login); 
router.post("/logout", authenticateUser, logout); 
router.post("/changepassword",authenticateUser, changePassword); 
router.post("/reset-password",authenticateUser, authorizeRoles("admin"), resetPassword);
export default router;
