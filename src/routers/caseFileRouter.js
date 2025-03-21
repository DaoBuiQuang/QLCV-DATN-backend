import express from "express";
import {
    getAllCaseFiles,
    getCaseFileById,
    createCaseFile,
    updateCaseFile,
    deleteCaseFile,
    searchCaseFilesCombined
} from "../controllers/caseFileController.js";

const router = express.Router();

// Lấy tất cả hồ sơ
router.get("/casefiles", getAllCaseFiles);
router.get("/casefiles/:caseFileId", getCaseFileById);
router.post("/casefiles/search", searchCaseFilesCombined);
router.post("/casefiles", createCaseFile);
router.put("/casefiles/:caseFileId", updateCaseFile);
router.delete("/casefiles/:caseFileId", deleteCaseFile);

export default router;
