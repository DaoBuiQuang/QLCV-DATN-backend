import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { DonDangKy } from "./donDangKyModel.js";

export const TaiLieu = sequelize.define("TaiLieu", {
    maTaiLieu: {  
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    maDon: {  
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DonDangKy,
            key: "maDonDangKy",
        },
    },
    tenTaiLieu: { 
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkTaiLieu: {  
        type: DataTypes.STRING,
        allowNull: true,
    },
    trangThai: {  
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "TaiLieu",
});
