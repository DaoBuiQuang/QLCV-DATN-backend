import { Auth } from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NhanSu } from "../models/nhanSuModel.js";

export const register = async (req, res) => {
    try {
        const { maNhanSu, username, password, role } = req.body;

        if (!maNhanSu || !username || !password || !role) {
            return res.status(400).json({ message: "Mã nhân sự, tên đăng nhập, mật khẩu và vai trò là bắt buộc" });
        }
        const existingUser = await Auth.findOne({ where: { Username: username } });
        if (existingUser) {
            return res.status(400).json({ message: "Tên đăng nhập đã được sử dụng" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Auth.create({
            maNhanSu,
            Username: username,
            PasswordHash: hashedPassword,
            Role: role,
        });

        res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Tên đăng nhập và mật khẩu là bắt buộc" });
        }
        const user = await Auth.findOne({
            where: { Username: username },
            include: [
                {
                    model: NhanSu,
                    as: 'nhanSu', // dùng alias đúng như đã định nghĩa
                },
            ],
        });        
        if (!user) {
            return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }
        const ten = user.NhanSu?.tenNhanSu;
        const token = jwt.sign(
            { id: user.AuthID, maNhanSu: user.maNhanSu, role: user.Role, ten },
            "my_secret_key",
            { expiresIn: "7d" }
        );
        await user.update({ Token: token });

        res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const { authId } = req.body;
        const user = await Auth.findByPk(authId);
        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại" });
        }
        await user.update({ Token: null });
        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
