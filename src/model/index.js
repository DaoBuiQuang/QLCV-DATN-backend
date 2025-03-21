import { sequelize } from "../config/db.js";
import { Partner } from "./partnerModel.js"; 
import { Customer } from "./customerModel.js";
import { CaseType } from "./caseTypeModel.js";
import { Country } from "./countryModel.js";
import { Staff } from "./staffModel.js";
import {CaseFile} from "./caseFileModel.js"
import { Staff_CaseFile } from "./staff_caseFileModel.js";
import { Petition } from "./petitionModel.js";
import { Document } from "./documentModel.js";

export const syncDatabase = async () => {
    await sequelize.sync(); 
    console.log("✅ Database synchronized with all models");
};
