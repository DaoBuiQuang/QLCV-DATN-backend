import express from "express";
import {
    getPartners,
    getPartnerById,
    addPartner,
    updatePartner,
    deletePartner
} from "../controllers/doiTacController.js";

const router = express.Router();

router.post("/partner/list", getPartners); 
router.post("/partner/detail", getPartnerById); 
router.post("/partner/add", addPartner); 
router.put("/partner/update", updatePartner); 
router.delete("/partner/:id", deletePartner); 

export default router;
