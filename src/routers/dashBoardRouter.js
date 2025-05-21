import express from "express";
import { getStatisticsByHanXuLy, getStatisticsByStatus } from "../controllers/dashboardController.js";
const router = express.Router();
router.post("/application/statistics-by-status", getStatisticsByStatus);
router.post("/application/statistics-by-han-xu-ly", getStatisticsByHanXuLy);
export default router;