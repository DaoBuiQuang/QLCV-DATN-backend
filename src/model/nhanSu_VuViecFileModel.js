import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { NhanSu } from "./nhanSuModel.js";
import { VuViec } from "./vuViecModel.js";

export const NhanSu_VuViec = sequelize.define("NhanSu_VuViec", {
    maHoSo: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: VuViec,
            key: "maHoSo",
        },
    },
    maNhanSu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: NhanSu,
            key: "maNhanSu",
        },
    },
    vaiTro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ngayGiaoVuViec: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Mặc định là ngày hiện tại
    },
}, {
    timestamps: false,
    tableName: "nhansu_vuviec",
});
