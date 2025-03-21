import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const CaseType = sequelize.define("CaseType", {
    caseTypeId:{
        type: DataTypes.STRING, 
        primaryKey: true, 
    },
    caseTypeName:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    timestamps: true,
    tableName: "case_type",
})