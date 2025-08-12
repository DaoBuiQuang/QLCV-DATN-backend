import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

import { SanPham_DichVu } from "../sanPham_DichVuModel.js";
import { DonDangKyNhanHieu_KH } from "./donDangKyNhanHieu_KHModel.js";

export const DonDK_SPDV_KH = sequelize.define("DonDK_SPDV_KH", {
    maDonDangKy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DonDangKyNhanHieu_KH,
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
    tableName: "DonDK_SPDV_KH",
});
