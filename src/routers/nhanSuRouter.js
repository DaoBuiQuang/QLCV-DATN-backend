import express from "express";
import {
    createNhanSu,
    updateNhanSu,
    deleteNhanSu,
    getNhanSuList,
    getNhanSuById
} from "../controllers/nhanSuController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/staff/add", createNhanSu); 
router.put("/staff", updateNhanSu); 
router.get("/staff",authenticateUser, getNhanSuList);
router.post("/staff/detail", getNhanSuById); 
router.post("/staff/delete", deleteNhanSu);
export default router;
