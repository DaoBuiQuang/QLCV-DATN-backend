import express from "express";
import { addNhanHieu, deleteNhanHieu, getAllNhanHieu, getNhanHieuById, getShortListNhanHieu, updateNhanHieu } from "../controllers/nhanHieuController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/brand/list", getAllNhanHieu);
router.post("/brand/shortlist", getShortListNhanHieu);
router.post("/brand/detail",authenticateUser, getNhanHieuById);
router.post("/brand/add",authenticateUser, addNhanHieu);
router.put("/brand/edit",authenticateUser, updateNhanHieu);
router.post("/brand/delete",authenticateUser, deleteNhanHieu);

export default router;
