import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { KhachHangCuoi } from "./khanhHangCuoiModel.js";
import { DoiTac } from "./doiTacModel.js";

export const GiayUyQuyen = sequelize.define("GiayUyQuyen", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idKhachHang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: KhachHangCuoi,
            key: "id",
        },
    },
    idDoiTac: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: DoiTac,
            key: "id",
        },
    },
    maQuocGia: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    soDonGoc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayUyQuyen: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },

    ngayHetHan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    linkAnh: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ghiChu: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    maNhanSuCapNhap: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "GiayUyQuyen",
});
