import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const QuocGia = sequelize.define("QuocGia", {
    maQuocGia: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tenQuocGia: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    tableName: "QuocGia",
});
