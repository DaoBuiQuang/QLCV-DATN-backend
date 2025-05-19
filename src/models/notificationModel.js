import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { NhanSu } from "./nhanSuModel.js"; // Nếu bạn muốn liên kết với nhân sự

export const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  maNhanSu: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: NhanSu,
      key: "maNhanSu",
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true, // Có thể chứa thông tin bổ sung
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Mặc định là chưa đọc
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Ngày gửi
  },
}, {
  timestamps: true, // createdAt, updatedAt
  tableName: "notifications",
});
