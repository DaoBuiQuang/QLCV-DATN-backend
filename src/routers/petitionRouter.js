import express from "express";
import {
    getAllPetitions,
    getPetitionById,
    createPetition,
    updatePetition,
    deletePetition
} from "../controllers/petitionController.js";

const router = express.Router();
router.get("/petition", getAllPetitions);
router.get("/petition/:id", getPetitionById);
router.post("/petition", createPetition);
router.put("/petition/:id", updatePetition);
router.delete("petition/:id", deletePetition);

export default router;
