import { sequelize } from "../config/db.js";
import { Customer } from "./customerModel.js";
import { Partner } from "./partnerModel.js"; 
export const syncDatabase = async () => {
    await sequelize.sync(); 
    console.log("✅ Database synchronized with all models");
};
