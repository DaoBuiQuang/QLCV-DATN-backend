import express from "express";
import { addCustomer, getCustomers } from "../controllers/customerController.js";


const router = express.Router();

router.get("/customers", getCustomers); 
// router.get("/products/:id", getProductByIdController); 
router.post("/customer", addCustomer);
// router.put("/products/:id", updateProduct); 
// router.delete("/products/:id", deleteProduct); 

export default router;
