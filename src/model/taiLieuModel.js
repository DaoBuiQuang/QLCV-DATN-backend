import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { DonDangKy } from "./donDangKiModel.js";

export const Document = sequelize.define("Document", {
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
            key: "maDonDangKi",
        },
    },
    loaiTaiLieu: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    linkTaiLieu: {  
        type: DataTypes.STRING,
        allowNull: false,
    },
    trangThai: {  
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: "TaiLieu",
});
