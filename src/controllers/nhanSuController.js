import { NhanSu } from "../model/nhanSuModel.js";

// Thêm nhân viên
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

// Lấy danh sách nhân viên
export const getNhanSuList = async (req, res) => {
    try {
        const nhanSuList = await NhanSu.findAll();

        if (nhanSuList.length === 0) {
            return res.status(404).json({ message: "Không có nhân viên nào" });
        }

        res.status(200).json(nhanSuList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết nhân viên
export const getNhanSuById = async (req, res) => {
    try {
        const { maNhanSu } = req.body;

        const nhanSu = await NhanSu.findByPk(maNhanSu);
        if (!nhanSu) {
            return res.status(404).json({ message: "Nhân viên không tồn tại" });
        }

        res.status(200).json(nhanSu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
