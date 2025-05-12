import express from "express";
import { createApplication, deleteApplication, getAllApplication, getApplicationById, updateApplication } from "../controllers/donDangKyController.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/application/list",authenticateUser, getAllApplication);
router.post("/application/add",authenticateUser, authorizeRoles("admin", "staff"), createApplication);
router.post("/application/detail",authenticateUser, getApplicationById);
router.put("/application/edit",authenticateUser, authorizeRoles("admin", "staff"), updateApplication);
router.post("/application/delete",authenticateUser, authorizeRoles("admin", "staff"), deleteApplication);

export default router;
