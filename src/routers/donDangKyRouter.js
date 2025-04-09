import express from "express";
import { createApplication, deleteApplication, getAllApplication, getApplicationById, updateApplication } from "../controllers/donDangKyController.js";

const router = express.Router();

router.post("/application/list", getAllApplication);
router.post("/application/add", createApplication);
router.post("/application/detail", getApplicationById);
router.put("/application/edit", updateApplication);
router.post("/application/delete", deleteApplication);

export default router;
