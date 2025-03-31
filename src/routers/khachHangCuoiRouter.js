import express from "express";
import {
    getCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    generateCustomerCode
} from "../controllers/khachHangCuoiController.js";

const router = express.Router();
router.post('/customer/generate-code', generateCustomerCode);
router.post("/customer/list", getCustomers);            // Lấy danh sách (có tìm kiếm theo tên, đối tác, quốc gia, ngành nghề)
router.post("/customer/detail", getCustomerById);       // Lấy chi tiết 1 khách hàng
router.post("/customer/add", addCustomer);              // Thêm khách hàng
router.put("/customer/edit", updateCustomer);         // Cập nhật khách hàng
router.post("/customer/delete", deleteCustomer);        // Xóa khách hàng

export default router;
