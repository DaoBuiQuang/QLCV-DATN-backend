import { NganhNghe } from "../models/nganhNgheModel";
import { Op } from "sequelize";


// Lấy danh sách ngành nghề (tìm theo tên nếu có)
export const getIndustries = async (req, res) => {
    try {
        const { search } = req.body; // Nhận từ body thay vì query
        let industries;

        if (search) {
            industries = await NganhNghe.findAll({
                where: { tenNganhNghe: { [Op.like]: `%${search}%` } },
            });
        } else {
            industries = await NganhNghe.findAll();
        }

        if (!industries.length) {
            return res.status(404).json({ message: "Không có ngành nghề nào" });
        }

        res.status(200).json(industries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy ngành nghề theo ID
export const getIndustryById = async (req, res) => {
    try {
        const { id } = req.body; // Nhận ID từ body thay vì params
        if (!id) {
            return res.status(400).json({ message: "Thiếu mã ngành nghề" });
        }

        const industry = await NganhNghe.findByPk(id);

        if (!industry) {
            return res.status(404).json({ message: "Ngành nghề không tồn tại" });
        }

        res.status(200).json(industry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm ngành nghề mới
export const addIndustry = async (req, res) => {
    try {
        const { maNganhNghe, tenNganhNghe } = req.body;

        if (!maNganhNghe || !tenNganhNghe) {
            return res.status(400).json({ message: "Điền đầy đủ các thông tin" });
        }

        const newIndustry = await NganhNghe.create({ maNganhNghe, tenNganhNghe });

        res.status(201).json(newIndustry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật ngành nghề
export const updateIndustry = async (req, res) => {
    try {
        const { id, tenNganhNghe } = req.body; // Lấy ID và tên từ body

        if (!id || !tenNganhNghe) {
            return res.status(400).json({ message: "Thiếu thông tin cập nhật" });
        }

        const industry = await NganhNghe.findByPk(id);

        if (!industry) {
            return res.status(404).json({ message: "Ngành nghề không tồn tại" });
        }

        industry.tenNganhNghe = tenNganhNghe;
        await industry.save();

        res.status(200).json({ message: "Cập nhật ngành nghề thành công", industry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa ngành nghề
export const deleteIndustry = async (req, res) => {
    try {
        const { id } = req.body; // Lấy ID từ body

        if (!id) {
            return res.status(400).json({ message: "Thiếu mã ngành nghề để xóa" });
        }

        const industry = await NganhNghe.findByPk(id);
        if (!industry) {
            return res.status(404).json({ message: "Ngành nghề không tồn tại" });
        }

        await industry.destroy();
        res.status(200).json({ message: "Xóa ngành nghề thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
