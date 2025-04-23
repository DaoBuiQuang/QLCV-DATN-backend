import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { HoSo_VuViec } from "./hoSoVuViecModel.js";


export const HopDongVuViec = sequelize.define("HopDongVuViec", {
    maHopDong: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    maHoSoVuViec: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: HoSo_VuViec,
            key: "maHoSoVuViec",
        },
    },
    ngayKy: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    moTaHopDong: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    noiDungThanhToan: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    hanThanhToan: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    trangThai: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Chưa thanh toán",
    },
}, {
    timestamps: true,
    tableName: "HopDongVuViec",
});

