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
router.post("/casetype/detail", getCaseTypeById); 
router.post("/casetype/add", addCaseType); 
router.put("/casetype/edit", updateCaseType); 
router.post("/casetype/delete", deleteCaseType); 

router.post("/industry/list", getIndustries);
router.post("/industry/detail", getIndustryById); 
router.post("/industry/add", addIndustry); 
router.put("/industry/edit", updateIndustry); 
router.post("/industry/delete", deleteIndustry); 
export default router;
