import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { DonDangKy } from "./donDangKyModel.js";
import { SanPham_DichVu } from "./sanPham_DichVuModel.js";

export const DonDK_SPDV = sequelize.define("DonDK_SPDV", {
    maDonDangKy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DonDangKy,
            key: "maDonDangKy",
        },
    },
    maSPDV: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: SanPham_DichVu,
            key: "maSPDV",
        },
    },
}, {
    timestamps: true,
    tableName: "DonDK_SPDV",
});
