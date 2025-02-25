import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: "products",
});

// Đồng bộ database
export const syncDatabase = async () => {
    await sequelize.sync();
    console.log("✅ Database synchronized");
};
