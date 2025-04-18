import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { DonDangKy } from "./donDangKyModel.js";


export const DonDangKy_BuocXuLy = sequelize.define("DonDangKy_BuocXuLy", {
    maDonDangKy_TrangThai: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    maDonDangKy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DonDangKy,
            key: 'maDonDangKy'
        }
    },
    buocXuLy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tenBuocXuLy:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    trangThaiXuLy:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    ngayDuKien:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayThucTe:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayTraLoiTuChoi:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayGiaHanTraLoiTuChoi:{
        type: DataTypes.DATE,
        allowNull: true,
    }

}, {
    timestamps: true,
    tableName: "DonDangKy_BuocXuLy",
});
