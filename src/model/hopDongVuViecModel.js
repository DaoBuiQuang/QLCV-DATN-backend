import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { HoSo_VuViec } from "./hoSoVuViecModel.js";


export const HopDongVuViec = sequelize.define("HopDongVuViec", {
    MaHopDong: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    MaHoSoVuViec: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: HoSo_VuViec,
            key: "maHoSoVuViec",
        },
    },
    NgayKy: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    MoTaHopDong: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    NoiDungThanhToan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    HanThanhToan: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    TrangThai: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Chưa thanh toán",
    },
}, {
    timestamps: false,
    tableName: "HopDongVuViec",
});

