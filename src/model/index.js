import { sequelize } from "../config/db.js";

export const syncDatabase = async () => {
    await sequelize.sync(); 
    console.log("✅ Database synchronized with all models");
};
