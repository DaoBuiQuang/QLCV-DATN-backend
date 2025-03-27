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

router.post("/casetype/list", getCaseTypes); // Lấy danh sách loại vụ việc
router.post("/casetype/detail", getCaseTypeById); // Lấy loại vụ việc theo ID
router.post("/casetype/add", addCaseType); // Thêm loại vụ việc mới
router.put("/casetype/edit", updateCaseType); // Cập nhật loại vụ việc
router.delete("/casetype/delete", deleteCaseType); // Xóa loại vụ việc

router.post("/industry/list", getIndustries);
router.post("/industry/detail", getIndustryById); // Lấy chi tiết ngành nghề theo ID
router.post("/industry/add", addIndustry); // Thêm ngành nghề mới
router.post("/industry/update", updateIndustry); // Cập nhật ngành nghề
router.post("/industry/delete", deleteIndustry); // Xóa ngành nghề
export default router;
