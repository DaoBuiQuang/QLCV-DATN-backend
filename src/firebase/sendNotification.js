// sendNotification.js
import admin from "./firebaseAdmin.js";
import { FCMToken } from "../models/fcmTokenModel.js";
import { Notification } from "../models/notificationModel.js"; // ✅ import bảng notification
import { Op } from "sequelize";
import { Auth } from "../models/authModel.js"; 

export const saveTokenFireBase = async (req, res) => {
  const { token, maNhanSu } = req.body;
  if (!token || !maNhanSu) {
    return res.status(400).json({ message: "Thiếu token hoặc mã nhân sự" });
  }

  try {
    const existing = await FCMToken.findOne({
      where: { token, maNhanSu },
    });

    if (existing) {
      return res.status(200).json({ message: "Token đã tồn tại, không cần lưu lại" });
    }
    await FCMToken.create({ token, maNhanSu });

    return res.status(201).json({ message: "Lưu token thành công" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNotificationsByNhanSu = async (req, res) => {
  const { maNhanSu } = req.body;

  if (!maNhanSu) {
    return res.status(400).json({ message: "Thiếu mã nhân sự" });
  }

  try {
    const notifications = await Notification.findAll({
      where: { maNhanSu },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
export const sendNotification = async (req, res) => {
    const { token, title, body } = req.body;

    const message = {
        notification: { title, body },
        token: token,
    };

    try {
        const response = await admin.messaging().send(message);
        res.status(200).json({ success: true, response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const sendNotificationToMany = async (tokens, title, body) => {
  try {
    if (!Array.isArray(tokens) || tokens.length === 0) {
      return { success: false, message: "Danh sách token rỗng" };
    }

    // 1. Lấy token hợp lệ từ DB
    const tokensData = await FCMToken.findAll({
      where: { token: { [Op.in]: tokens } },
    });
    const validTokens = tokensData.map(item => item.token);
    if (validTokens.length > 0) {
      const message = {
        notification: { title, body },
        tokens: validTokens,
      };
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log("Multicast sent:", response);
    } else {
      console.log("Không có token hợp lệ để gửi push");
    }
    const adminUsers = await Auth.findAll({
      where: { Role: "admin" },
      attributes: ["maNhanSu"],
    });

    if (adminUsers.length === 0) {
      return { success: false, message: "Không tìm thấy người dùng admin để lưu thông báo" };
    }
    const notifications = adminUsers.map(({ maNhanSu }) => ({
      maNhanSu,
      title,
      body,
    }));

    await Notification.bulkCreate(notifications);

    return { success: true, message: "Gửi push và lưu thông báo cho admin thành công" };
  } catch (error) {
    console.error("Lỗi gửi/lưu thông báo:", error);
    return { success: false, error: error.message };
  }
};

