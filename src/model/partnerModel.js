import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Partner = sequelize.define("Partner", {
    partnerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    partnerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: "partners",
});
