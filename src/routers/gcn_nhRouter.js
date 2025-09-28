import express from "express";

import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { getGCN_NHDetail, getGCN_NHs } from "../controllers/gcn_nhController.js";
const router = express.Router();
router.post("/gcn_nh/list", authenticateUser, getGCN_NHs);    
router.post("/gcn_nh/detail", authenticateUser, getGCN_NHDetail);        
    
export default router;
