import { DonDangKy } from "../models/donDangKyModel.js";
import { LoaiDon } from "../models/loaiDonModel.js";


export const getAllApplication = async (req, res) => {
    try {
        const list = await DonDangKy.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [GET] /api/loaidon/all - Lấy danh sách tất cả loại đơn
export const getAllLoaiDon = async (req, res) => {
    try {
        const list = await LoaiDon.findAll();
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
};

// [POST] /api/loaidon/get - Lấy loại đơn theo mã (dùng body)
export const getLoaiDonById = async (req, res) => {
    const { maLoaiDon } = req.body;
    try {
        const loaiDon = await LoaiDon.findByPk(maLoaiDon);
        if (!loaiDon) return res.status(404).json({ message: "Không tìm thấy loại đơn" });
        res.json(loaiDon);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
};

// [POST] /api/loaidon/create - Thêm loại đơn mới
export const createLoaiDon = async (req, res) => {
    const { maLoaiDon, tenLoaiDon, moTa } = req.body;
    try {
        const newLoaiDon = await LoaiDon.create({ maLoaiDon, tenLoaiDon, moTa });
        res.status(201).json(newLoaiDon);
    } catch (err) {
        res.status(400).json({ error: "Lỗi khi tạo: " + err.message });
    }
};

// [PUT] /api/loaidon/update - Cập nhật loại đơn
export const updateLoaiDon = async (req, res) => {
    const { maLoaiDon, tenLoaiDon, moTa } = req.body;
    try {
        const loaiDon = await LoaiDon.findByPk(maLoaiDon);
        if (!loaiDon) return res.status(404).json({ message: "Không tìm thấy loại đơn" });

        loaiDon.tenLoaiDon = tenLoaiDon;
        loaiDon.moTa = moTa;
        await loaiDon.save();

        res.json(loaiDon);
    } catch (err) {
        res.status(400).json({ error: "Lỗi khi cập nhật: " + err.message });
    }
};

// [DELETE] /api/loaidon/delete - Xoá loại đơn
export const deleteLoaiDon = async (req, res) => {
    const { maLoaiDon } = req.body;
    try {
        const loaiDon = await LoaiDon.findByPk(maLoaiDon);
        if (!loaiDon) return res.status(404).json({ message: "Không tìm thấy loại đơn" });

        await loaiDon.destroy();
        res.json({ message: "Đã xoá loại đơn thành công" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi xoá: " + err.message });
    }
};
