import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("QLCV", "root", "22082003", {
    host: "localhost",
    dialect: "mysql",
    logging: false, // Tắt log SQL
});

// Kết nối cơ sở dữ liệu
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to MySQL database using Sequelize");
    } catch (error) {
        console.error("❌ MySQL connection error:", error);
    }
};
