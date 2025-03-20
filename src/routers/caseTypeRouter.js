import express from "express";
import { addCaseType, getCaseType } from "../controllers/caseTypeController.js";


const router = express.Router();

router.get("/casetype", getCaseType); 
router.post("/casetype", addCaseType);
export default router;
