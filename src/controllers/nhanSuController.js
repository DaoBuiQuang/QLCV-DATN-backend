import { NhanSu } from "../models/nhanSuModel.js";
import { Auth } from "../models/authModel.js";
import { Sequelize } from "sequelize";

// Thêm nhân viên
export const getNhanSuBasicList = async (req, res) => {
    try {
        const nhanSuList = await NhanSu.findAll({
            attributes: ["maNhanSu", "hoTen"] 
        });

        if (nhanSuList.length === 0) {
            return res.status(404).json({ message: "Không có nhân viên nào" });
        }

        res.status(200).json(nhanSuList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createNhanSu = async (req, res) => {
    try {
        const { maNhanSu, hoTen, chucVu, phongBan, sdt, email, ngayThangNamSinh, cccd, bangCap } = req.body;

        if (!maNhanSu || !hoTen) {
            return res.status(400).json({ message: "Mã nhân sự và họ tên là bắt buộc" });
        }

        const existingNhanSu = await NhanSu.findOne({ where: { maNhanSu } });
        if (existingNhanSu) {
            return res.status(400).json({ message: "Mã nhân sự đã tồn tại" });
        }

        const newNhanSu = await NhanSu.create({ maNhanSu, hoTen, chucVu, phongBan, sdt, email, ngayThangNamSinh, cccd, bangCap });

        res.status(201).json({ message: "Thêm nhân viên thành công", nhanSu: newNhanSu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNhanSu = async (req, res) => {
    try {
        const { maNhanSu, hoTen, chucVu, phongBan, sdt, email, ngayThangNamSinh, cccd, bangCap } = req.body;

        const nhanSu = await NhanSu.findByPk(maNhanSu);
        if (!nhanSu) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        await nhanSu.update({ hoTen, chucVu, phongBan, sdt, email, ngayThangNamSinh, cccd, bangCap });

        res.status(200).json({ message: "Cập nhật nhân viên thành công", nhanSu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa nhân viên
export const deleteNhanSu = async (req, res) => {
    try {
        const { maNhanSu } = req.body;

        const nhanSu = await NhanSu.findByPk(maNhanSu);
        if (!nhanSu) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        await nhanSu.destroy();

        res.status(200).json({ message: "Xóa nhân viên thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách nhân viên kèm theo tên tài khoản
export const getNhanSuList = async (req, res) => {
    try {
        const nhanSuList = await NhanSu.findAll({
            include: [
                {
                    model: Auth,
                    as: "auth", // Alias phải khớp với quan hệ đã định nghĩa
                    attributes: ["Username"], // Chỉ lấy tên tài khoản
                }
            ]
        });

        if (nhanSuList.length === 0) {
            return res.status(404).json({ message: "Không có nhân viên nào" });
        }

        const result = nhanSuList.map(nhanSu => {
            const { Username } = nhanSu.auth || {}; // Lấy Username từ quan hệ Auth
            const nhanSuData = nhanSu.toJSON(); // Chuyển nhanSu thành đối tượng JSON
            delete nhanSuData.auth; // Xóa trường `auth` khỏi kết quả
            return { 
                ...nhanSuData, // Lấy tất cả thông tin nhân viên
                Username // Thêm trường Username vào đối tượng nhân viên
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết nhân viên
export const getNhanSuById = async (req, res) => {
    try {
        const { maNhanSu } = req.body;

        const nhanSu = await NhanSu.findByPk(maNhanSu, {
            include: [{
                model: Auth,
                as: "auth", // 👈 PHẢI thêm dòng này nếu đã định nghĩa alias
                attributes: ["Username"],
                required: false
            }]
        });

        if (!nhanSu) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }
        const data = nhanSu.toJSON();
        const response = {
            ...data,
            tenTaiKhoan: data.auth?.Username || null
        };
        delete response.auth;
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

