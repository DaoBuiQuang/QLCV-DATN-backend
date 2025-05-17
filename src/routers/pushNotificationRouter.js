import express from "express";
import sendNotification from "../firebase/sendNotification.js";
const router = express.Router();


router.post('/send-notification', sendNotification);
export default router;