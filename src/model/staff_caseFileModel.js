import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Staff } from "./staffModel.js";
import { CaseFile } from "./caseFileModel.js";

export const Staff_CaseFile = sequelize.define("Staff_CaseFile", {
    caseFileId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: CaseFile,
            key: "caseFileId",
        },
    },
    staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Staff,
            key: "staffId",
        },
    },
}, {
    timestamps: false,
    tableName: "staff_casefile",
    primaryKey: ["caseFileId", "staffId"], 
});
