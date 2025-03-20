import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Partner } from "./partnerModel.js"; // Import model Partner

export const Customer = sequelize.define("Customer", {
    customerId: {
        type: DataTypes.STRING, 
        primaryKey: true, 
    },
    partnerId: {
        type: DataTypes.INTEGER,
        allowNull: true, 
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
