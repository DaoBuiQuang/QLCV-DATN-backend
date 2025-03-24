import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const NganhNghe = sequelize.define("NganhNghe", {
    maNganhNghe: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tenNganhNghe: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    tableName: "NganhNghe",
});
