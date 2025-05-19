import express from "express";
import { getNotificationsByNhanSu, saveTokenFireBase, sendNotification,  } from "../firebase/sendNotification.js";
const router = express.Router();

router.post('/save-token', saveTokenFireBase);
router.post('/send-notification', sendNotification);
router.post('/send-notification-to-many', getNotificationsByNhanSu);
export default router;