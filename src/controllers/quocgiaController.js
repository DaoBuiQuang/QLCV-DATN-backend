import { Op } from "sequelize";
import { QuocGia } from "../model/quocGiaModel.js";

// Lấy danh sách quốc gia (có thể tìm theo tên nếu có query 'search' trong body)
export const getCountries = async (req, res) => {
    try {
        const { search } = req.body; // Lấy từ body thay vì query
        let countries;
        if (search) {
            countries = await QuocGia.findAll({
                where: { tenQuocGia: { [Op.like]: `%${search}%` } },
            });
        } else {
            countries = await QuocGia.findAll();
        }
        if (countries.length === 0) {
            return res.status(404).json({ message: "Không có quốc gia nào" });
        }
        res.status(200).json(countries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getCountryById = async (req, res) => {
    try {
        const { maQuocGia } = req.body;
        if (!maQuocGia) {
            return res.status(400).json({ message: "Thiếu mã quốc gia" });
        }
        const country = await QuocGia.findByPk(maQuocGia);
        if (!country) {
            return res.status(404).json({ message: "Quốc gia không tồn tại" });
        }
        res.status(200).json(country);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm quốc gia
export const addCountry = async (req, res) => {
    try {
        const { maQuocGia, tenQuocGia } = req.body;
        if (!maQuocGia || !tenQuocGia) {
            return res.status(400).json({ message: "Điền đầy đủ các thông tin" });
        }
        const newCountry = await QuocGia.create({ maQuocGia, tenQuocGia });
        res.status(201).json(newCountry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin quốc gia từ body
export const updateCountry = async (req, res) => {
    try {
        const { maQuocGia, tenQuocGia } = req.body;

        if (!maQuocGia || !tenQuocGia) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        const country = await QuocGia.findByPk(maQuocGia);
        if (!country) {
            return res.status(404).json({ message: "Quốc gia không tồn tại" });
        }
        country.tenQuocGia = tenQuocGia;
        await country.save();
        res.status(200).json({ message: "Cập nhật quốc gia thành công", country });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa quốc gia từ body
export const deleteCountry = async (req, res) => {
    try {
        const { maQuocGia } = req.body;
        if (!maQuocGia) {
            return res.status(400).json({ message: "Thiếu mã quốc gia" });
        }
        const country = await QuocGia.findByPk(maQuocGia);
        if (!country) {
            return res.status(404).json({ message: "Quốc gia không tồn tại" });
        }
        await country.destroy();
        res.status(200).json({ message: "Xóa quốc gia thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
