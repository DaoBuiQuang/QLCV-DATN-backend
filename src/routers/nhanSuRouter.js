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

router.post("/nhansu", createNhanSu); 
router.put("/nhansu", updateNhanSu); 
router.get("/nhansu",authenticateUser, getNhanSuList);
router.post("/nhansu/detail", getNhanSuById); 
router.post("/nhansu/delete", deleteNhanSu);
export default router;
