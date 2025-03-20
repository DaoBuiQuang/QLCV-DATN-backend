import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Country = sequelize.define("Country", {
    countryId:{
        type: DataTypes.STRING, 
        primaryKey: true, 
    },
    countryName:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    timestamps: true,
    tableName: "country",
})