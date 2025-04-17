import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const SanPham_DichVu = sequelize.define("SanPham_DichVu", {
    maSPDV: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tenSPDV: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    moTa:{
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: "SanPham_DichVu",
});
