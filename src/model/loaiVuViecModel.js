import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const LoaiVuViec = sequelize.define("loaiVuViec", {
    maLoaiVuViec:{
        type: DataTypes.STRING, 
        primaryKey: true, 
    },
    TenLoaiVuViec:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    moTa:{
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    timestamps: true,
    tableName: "LoaiVuViec",
})