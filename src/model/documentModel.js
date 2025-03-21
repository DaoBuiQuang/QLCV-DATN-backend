import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Petition } from "./petitionModel.js";

export const Document = sequelize.define("Document", {
    documentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    petitionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Petition,
            key: "petitionId",
        },
    },
    documentType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    documentLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: "document",
});
