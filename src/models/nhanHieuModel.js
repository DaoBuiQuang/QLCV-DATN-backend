import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const NhanHieu = sequelize.define("NhanHieu", {
    maNhanHieu: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tenNhanHieu: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    moTa:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkAnh: {  
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "NhanHieu",
});
