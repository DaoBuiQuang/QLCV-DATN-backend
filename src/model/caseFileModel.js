import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Customer } from "./customerModel.js";
import { CaseType } from "./caseTypeModel.js";
import { Country } from "./countryModel.js";
export const CaseFile = sequelize.define("CaseFile",{
    caseFileId:{
        type: DataTypes.STRING,
        primaryKey: true,
    },
    customerId:{
        type: DataTypes.STRING,
        allowNull: true,
        references:{
            model: Customer,
            key: "customerId",
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    receivedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    processedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    caseTypeId:{
        type: DataTypes.STRING,
        allowNull: true,
        references:{
            model: CaseType,
            key: "caseTypeId",
        }
    },
    countryId:{
        type: DataTypes.STRING,
        allowNull: true,
        references:{
            model: Country,
            key: "countryId",
        }
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: "case_files",
})