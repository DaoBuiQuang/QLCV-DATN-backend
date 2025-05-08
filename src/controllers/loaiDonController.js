import { DonDangKy } from "../models/donDangKyModel.js";
import { LoaiDon } from "../models/loaiDonModel.js";
import { Op } from "sequelize";

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
        const { search } = req.body; // Lấy từ khóa tìm kiếm từ request body

        let list;
        if (search) {
            list = await LoaiDon.findAll({
                where: {
                    [Op.or]: [ // Sử dụng Op.or để tìm kiếm theo tên đơn hoặc mô tả
                        {
                            tenLoaiDon: { [Op.like]: `%${search}%` }
                        },
                        {
                            moTa: { [Op.like]: `%${search}%` }
                        }
                    ]
                }
            });
        } else {
            list = await LoaiDon.findAll();
        }
        if (list.length === 0) {
            return res.status(404).json({ message: "Không có loại đơn nào" });
        }
        res.status(200).json(list);
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

    if (!maLoaiDon || !tenLoaiDon) {
        return res.status(400).json({ error: "Vui lòng điền đầy đủ mã và tên loại đơn" });
    }

    try {
        const existingLoaiDon = await LoaiDon.findOne({ where: { maLoaiDon } });
        if (existingLoaiDon) {
            return res.status(409).json({ error: "Mã loại đơn đã tồn tại!" });
        }
        const newLoaiDon = await LoaiDon.create({ maLoaiDon, tenLoaiDon, moTa });
        res.status(201).json(newLoaiDon);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi tạo: " + err.message });
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
        if (!maLoaiDon) {
            return res.status(400).json({ message: "Thiếu mã loại đơn" });
        }

        const loaiDon = await LoaiDon.findByPk(maLoaiDon);
        if (!loaiDon) {
            return res.status(404).json({ message: "Không tìm thấy loại đơn" });
        }

        await loaiDon.destroy();
        res.json({ message: "Đã xoá loại đơn thành công" });
    } catch (err) {
        if (err.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Loại đơn đang được sử dụng, không thể xóa." });
        }

        res.status(500).json({ error: "Lỗi khi xoá: " + err.message });
    }
};
