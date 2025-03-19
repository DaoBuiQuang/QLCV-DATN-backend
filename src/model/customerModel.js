import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Partner } from "./partnerModel.js"; // Import model Partner

export const Customer = sequelize.define("Customer", {
    customerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    partnerId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Khách hàng có thể có hoặc không có đối tác
        references: {
            model: Partner,
            key: "partnerId",
        },
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: "customers",
});
