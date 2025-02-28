import { Course } from "../model/courseModel.js";

// Lấy tất cả khóa học
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        if (courses.length === 0) {
            return res.status(404).json({ message: "Không có khóa học nào" });
        }
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy khóa học theo ID
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm khóa học mới
export const addCourse = async (req, res) => {
    try {
        const { title, description, price, discount, duration, status } = req.body;

        if (!title || !price || !duration) {
            return res.status(400).json({ message: "Tiêu đề, giá và thời lượng khóa học là bắt buộc" });
        }

        const newCourse = await Course.create({ title, description, price, discount, duration, status });
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật khóa học
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, discount, duration, status } = req.body;

        if (!title || !price || !duration) {
            return res.status(400).json({ message: "Tiêu đề, giá và thời lượng khóa học là bắt buộc" });
        }

        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }

        course.title = title;
        course.description = description;
        course.price = price;
        course.discount = discount;
        course.duration = duration;
        course.status = status;
        await course.save();

        res.status(200).json({ message: "Cập nhật khóa học thành công", course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa khóa học
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }

        await course.destroy();
        res.status(200).json({ message: "Xóa khóa học thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
