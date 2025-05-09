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
    ngayBiTuChoiTD: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    ketQuaThamDinh: {
        type: DataTypes.ENUM('Dat', 'KhongDat'), 
        allowNull: false,
    },
    hanTraLoi: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    giaHan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    // ngayGiaHanMoi: {
    //     type: DataTypes.DATE,
    //     allowNull: true,
    // },
    ghiChu: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "LichSuThamDinh",
});
