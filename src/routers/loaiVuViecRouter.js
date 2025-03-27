import express from "express";
import { 
    getCaseTypes, 
    getCaseTypeById, 
    addCaseType, 
    updateCaseType, 
    deleteCaseType, 
    getIndustries,
    getIndustryById,
    addIndustry,
    updateIndustry,
    deleteIndustry
} from "../controllers/loaiVuViecController.js";

const router = express.Router();

router.post("/casetype/list", getCaseTypes); 
router.post("/casetype/detail", getCaseTypeById); // Lấy loại vụ việc theo ID
router.post("/casetype/add", addCaseType); 
router.put("/casetype/edit", updateCaseType); 
router.delete("/casetype/delete", deleteCaseType); 

router.post("/industry/list", getIndustries);
router.post("/industry/detail", getIndustryById); 
router.post("/industry/add", addIndustry); 
router.post("/industry/update", updateIndustry); 
router.post("/industry/delete", deleteIndustry); 
export default router;
