import express from "express";
import { addCountry, getCountries, getCountryById, updateCountry, deleteCountry } from "../controllers/quocgiaController.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/country/list",authenticateUser, getCountries);
router.post("/country/detail",authenticateUser, getCountryById);
router.post("/country/add",authenticateUser, authorizeRoles("admin", "user"), addCountry);
router.put("/country/update",authenticateUser, authorizeRoles("admin", "user"), updateCountry);
router.post("/country/delete",authenticateUser, authorizeRoles("admin", "user"), deleteCountry);

export default router;
