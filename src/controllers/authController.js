import { Auth } from "../model/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Đăng ký tài khoản
export const register = async (req, res) => {
    try {
        const { fullname, email, password, phone, role } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "Họ tên, email và mật khẩu là bắt buộc" });
        }

        const existingUser = await Auth.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Auth.create({ fullname, email, password: hashedPassword, phone, role });

        res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Đăng nhập
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
        }

        const user = await Auth.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        console.log("JWT_SECRET:", process.env.JWT_SECRET); // ✅ Kiểm tra giá trị
        const token = jwt.sign({ id: user.id, role: user.role }, "my_secret_key", { expiresIn: "1d" });
        
        res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Đăng xuất
export const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
