import express from "express";
import {
    createNhanSu,
    updateNhanSu,
    deleteNhanSu,
    getNhanSuList,
    getNhanSuById
} from "../controllers/nhanSuController.js";

const router = express.Router();

router.post("/nhansu", createNhanSu); 
router.put("/nhansu", updateNhanSu); 
router.get("/nhansu", getNhanSuList);
router.post("/nhansu/detail", getNhanSuById); 
router.post("/nhansu/delete", deleteNhanSu);
export default router;
