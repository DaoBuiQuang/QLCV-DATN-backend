import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { DonDangKy } from "./donDangKyModel.js"; 

export const LichSuThamDinh = sequelize.define("LichSuThamDinh", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    maDonDangKy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DonDangKy,
            key: "maDonDangKy",
        },
    },
    loaiThamDinh: {
        type: DataTypes.ENUM('HinhThuc', 'NoiDung'), 
        allowNull: false,
    },
    lanThamDinh: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ngayCoKQThamDinh: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ketQuaThamDinh: {
        type: DataTypes.ENUM('ThanhCong', 'ThatBai'), 
        allowNull: false,
    },
    ngayHanTraLoiKetQuaThamDinh: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    coGiaHan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    ngayGiaHanMoi: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ghiChu: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "LichSuThamDinh",
});
