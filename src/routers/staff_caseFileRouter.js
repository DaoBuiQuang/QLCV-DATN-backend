import express from "express";
import {
    getAllStaffCaseFiles,
    getCaseFilesByStaffId,
    getStaffByCaseFileId,
    assignStaffToCaseFile,
    removeStaffFromCaseFile
} from "../controllers/staff_caseFileController.js";

const router = express.Router();

router.get("/", getAllStaffCaseFiles);
router.get("/staff/:staffId", getCaseFilesByStaffId);
router.get("/casefile/:caseFileId", getStaffByCaseFileId);
router.post("/assign", assignStaffToCaseFile);

router.delete("/:caseFileId/:staffId", removeStaffFromCaseFile);

export default router;
