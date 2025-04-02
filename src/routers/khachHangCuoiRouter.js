import express from "express";
import {
    getCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    generateCustomerCode,
    getCustomerNamesAndCodes
} from "../controllers/khachHangCuoiController.js";

const router = express.Router();
router.post('/customers/by-name', getCustomerNamesAndCodes);
router.post('/customer/generate-code', generateCustomerCode);
router.post("/customer/list", getCustomers);            
router.post("/customer/detail", getCustomerById);     
router.post("/customer/add", addCustomer);      
router.put("/customer/edit", updateCustomer);     
router.post("/customer/delete", deleteCustomer);      

export default router;
