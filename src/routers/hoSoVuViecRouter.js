import express from "express";
import { addCase, deleteCase, generateCaseCode, getCaseDetail, searchCases, updateCase } from "../controllers/hoSoVuViecController.js";

const router = express.Router();
router.post("/case/list", searchCases);            
router.post("/case/detail", getCaseDetail);      
router.post("/case/add", addCase);          
router.put("/case/edit", updateCase);       
router.post("/case/delete", deleteCase);    
router.post("/case/generate-code-case", generateCaseCode );  
export default router;
