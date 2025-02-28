import { sequelize } from "../config/db.js";
import { Product } from "./productModel.js";
import { Course } from "./courseModel.js"; 
import { Lesson } from "./lessonModel.js";
export const syncDatabase = async () => {
    await sequelize.sync(); 
    console.log("✅ Database synchronized with all models");
};
