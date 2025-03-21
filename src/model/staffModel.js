import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Staff = sequelize.define("Staff", {
    staffId: {
        type: DataTypes.INTEGER,  // Đổi từ STRING thành INTEGER
        primaryKey: true, 
        autoIncrement: true,  
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'), 
        allowNull: false,
    },
    staffName: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,  
    tableName: "staff",
});
