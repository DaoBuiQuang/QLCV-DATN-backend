import express from "express";
import { addCountry, getCountry } from "../controllers/countryController.js";


const router = express.Router();

router.get("/countrys", getCountry); 
router.post("/country", addCountry);
export default router;
