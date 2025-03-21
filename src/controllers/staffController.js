import { Staff } from "../model/staffModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Đăng ký nhân viên
export const registerStaff = async (req, res) => {
    try {
        const { username, password, role, staffName } = req.body;

        if (!username || !password || !role || !staffName) {
            return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
        }

        const existingStaff = await Staff.findOne({ where: { username } });
        if (existingStaff) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = await Staff.create({
            username,
            password: hashedPassword,
            role,
            staffName,
        });

        res.status(201).json({ message: "Đăng ký thành công", staff: newStaff });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Đăng nhập nhân viên
export const loginStaff = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
        }

        const staff = await Staff.findOne({ where: { username } });
        if (!staff) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không chính xác" });
        }

        const token = jwt.sign(
            { staffId: staff.staffId, username: staff.username, role: staff.role },
            "SECRET_KEY", 
            { expiresIn: "7d" }
        );

        res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách nhân viên
export const getStaffList = async (req, res) => {
    try {
        const staffList = await Staff.findAll({ attributes: { exclude: ["password"] } });

        if (staffList.length === 0) {
            return res.status(404).json({ message: "Không có nhân viên nào" });
        }

        res.status(200).json(staffList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết nhân viên theo ID
export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Staff.findByPk(id, { attributes: { exclude: ["password"] } });
        if (!staff) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
