import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Course } from "./courseModel.js";

export const Lesson = sequelize.define("Lesson", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    order_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: "lessons",
});

// Thiết lập quan hệ giữa Course và Lesson
Course.hasMany(Lesson, { foreignKey: "course_id", as: "lessons" });
Lesson.belongsTo(Course, { foreignKey: "course_id", as: "course" });
