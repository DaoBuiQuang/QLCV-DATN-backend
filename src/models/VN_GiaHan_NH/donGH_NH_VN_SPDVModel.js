import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

import { SanPham_DichVu } from "../sanPham_DichVuModel.js";
import { DonGiaHan_NH_VN } from "./donGiaHanNH_VNModel.js";


export const DonGH_NH_VN_SPDV = sequelize.define("DonGH_NH_VN_SPDV", {
    maDonGiaHan: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DonGiaHan_NH_VN,
            key: "maDonGiaHan",
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
    isAutoImport: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false = nhập tay, true = nhập máy
        comment: 'Phân biệt dữ liệu nhập tay hoặc nhập tự động'
    }
}, {
    timestamps: true,
    tableName: "DonGH_NH_VN_SPDV",
});
