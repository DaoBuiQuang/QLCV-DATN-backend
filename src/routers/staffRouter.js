import express from "express";
import {
    registerStaff,
    loginStaff,
    getStaffList,
    getStaffById
} from "../controllers/staffController.js";

const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.get("/staff", getStaffList);
router.get("/staff/:id", getStaffById);

export default router;
