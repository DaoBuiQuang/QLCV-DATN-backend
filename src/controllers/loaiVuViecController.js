import { Op } from "sequelize";
import { LoaiVuViec } from "../models/loaiVuViecModel.js";
import { NganhNghe } from "../models/nganhNgheModel.js";
// Lấy danh sách Loại Vụ Việc (có thể tìm theo tên nếu có query 'search' trong body)
export const getCaseTypes = async (req, res) => {
    try {
        const { search } = req.body; // Lấy từ body thay vì query
        let loaiVuViecs;
        if (search) {
            loaiVuViecs = await LoaiVuViec.findAll({
                where: { tenLoaiVuViec: { [Op.like]: `%${search}%` } },
            });
        } else {
            loaiVuViecs = await LoaiVuViec.findAll();
        }
        if (loaiVuViecs.length === 0) {
            return res.status(404).json({ message: "Không có loại vụ việc nào" });
        }
        res.status(200).json(loaiVuViecs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
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
// Lấy loại vụ việc theo ID
export const getCaseTypeById = async (req, res) => {
    try {
        const { maLoaiVuViec } = req.body;
        if (!maLoaiVuViec) {
            return res.status(400).json({ message: "Thiếu mã loại vụ việc" });
        }
        const loaiVuViec = await LoaiVuViec.findByPk(maLoaiVuViec);
        if (!loaiVuViec) {
            return res.status(404).json({ message: "Loại vụ việc không tồn tại" });
        }
        res.status(200).json(loaiVuViec);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm loại vụ việc
export const addCaseType = async (req, res) => {
    try {
        const { maLoaiVuViec, tenLoaiVuViec, moTa } = req.body;
        if (!maLoaiVuViec || !tenLoaiVuViec) {
            return res.status(400).json({ message: "Điền đầy đủ các thông tin" });
        }
        const newLoaiVuViec = await LoaiVuViec.create({ maLoaiVuViec, tenLoaiVuViec, moTa });
        res.status(201).json(newLoaiVuViec);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin loại vụ việc
export const updateCaseType = async (req, res) => {
    try {
        const { maLoaiVuViec, tenLoaiVuViec, moTa } = req.body;
        if (!maLoaiVuViec || !tenLoaiVuViec) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }
        const loaiVuViec = await LoaiVuViec.findByPk(maLoaiVuViec);
        if (!loaiVuViec) {
            return res.status(404).json({ message: "Loại vụ việc không tồn tại" });
        }
        loaiVuViec.tenLoaiVuViec = tenLoaiVuViec;
        loaiVuViec.moTa = moTa;
        await loaiVuViec.save();
        res.status(200).json({ message: "Cập nhật loại vụ việc thành công", loaiVuViec });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa loại vụ việc
export const deleteCaseType = async (req, res) => {
    try {
        const { maLoaiVuViec } = req.body;
        if (!maLoaiVuViec) {
            return res.status(400).json({ message: "Thiếu mã loại vụ việc" });
        }
        const loaiVuViec = await LoaiVuViec.findByPk(maLoaiVuViec);
        if (!loaiVuViec) {
            return res.status(404).json({ message: "Loại vụ việc không tồn tại" });
        }
        await loaiVuViec.destroy();
        res.status(200).json({ message: "Xóa loại vụ việc thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/////////
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
