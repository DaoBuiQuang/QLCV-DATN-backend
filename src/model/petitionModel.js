import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { CaseFile } from "./caseFileModel.js";
export const Petition = sequelize.define("Petition", {
    petitionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    caseFileId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: CaseFile,
            key: "caseFileId",
        },
    },
    submissionDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    deadlineForFileCompletion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    validPetitionDecisionDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    petitionPublicationDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    contentReviewDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: "petition",
});
