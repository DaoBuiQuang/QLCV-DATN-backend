import { sequelize } from "../config/db.js";
import { KhachHang } from "./customerModel.js";
import { DoiTac } from "./partnerModel.js"; 

export const syncDatabase = async () => {
    await sequelize.sync(); 
    console.log("✅ Database synchronized with all models");
};
