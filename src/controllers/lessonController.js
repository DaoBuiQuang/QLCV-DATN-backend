import { Lesson } from "../models/lessonModel.js";
import { Course } from "../models/courseModel.js";

// Lấy tất cả bài học
export const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.findAll({
            include: [{ model: Course, as: "course" }],
            order: [["order_number", "ASC"]], 
        });

        if (lessons.length === 0) {
            return res.status(404).json({ message: "Không có bài học nào" });
        }

        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy bài học theo ID
export const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id, {
            include: [{ model: Course, as: "course" }],
        });

        if (!lesson) {
            return res.status(404).json({ message: "Bài học không tồn tại" });
        }

        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm bài học mới
export const addLesson = async (req, res) => {
    try {
        const { course_id, title, content, video_url, order_number } = req.body;

        // Kiểm tra xem khóa học có tồn tại không
        const course = await Course.findByPk(course_id);
        if (!course) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }

        // Tạo bài học mới
        const newLesson = await Lesson.create({
            course_id,
            title,
            content,
            video_url,
            order_number,
        });

        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật bài học
export const updateLesson = async (req, res) => {
    try {
        const { title, content, video_url, order_number } = req.body;
        const { id } = req.params;

        const lesson = await Lesson.findByPk(id);
        if (!lesson) {
            return res.status(404).json({ message: "Bài học không tồn tại" });
        }

        lesson.title = title || lesson.title;
        lesson.content = content || lesson.content;
        lesson.video_url = video_url || lesson.video_url;
        lesson.order_number = order_number || lesson.order_number;

        await lesson.save();
        res.status(200).json({ message: "Cập nhật bài học thành công", lesson });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa bài học
export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByPk(id);

        if (!lesson) {
            return res.status(404).json({ message: "Bài học không tồn tại" });
        }

        await lesson.destroy();
        res.status(200).json({ message: "Xóa bài học thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
