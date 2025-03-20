import express from "express";
import { addPartner, getPartners } from "../controllers/partnerController.js";


const router = express.Router();

router.get("/partners", getPartners); 
router.post("/partner", addPartner);
export default router;
