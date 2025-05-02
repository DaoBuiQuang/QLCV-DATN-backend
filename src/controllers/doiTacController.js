import { Op } from "sequelize";
import { DoiTac } from "../models/doiTacModel.js";
import { QuocGia } from "../models/quocGiaModel.js";

export const getPartners = async (req, res) => {
    try {
        const { tenDoiTac, maQuocGia } = req.body;

        const whereCondition = {};
        if (tenDoiTac) {
            whereCondition.tenDoiTac = { [Op.like]: `%${tenDoiTac}%` };
        }
        if (maQuocGia) {
            whereCondition.maQuocGia = maQuocGia;
        }

        const partners = await DoiTac.findAll({
            where: whereCondition,
            attributes: ["maDoiTac", "tenDoiTac"], // Chỉ lấy thông tin của đối tác
            include: [
                {
                    model: QuocGia,
                    as: "quocGia",
                    attributes: ["tenQuocGia"], // Chỉ lấy tên quốc gia, bỏ mã quốc gia
                },
            ],
        });

        if (!partners.length) {
            return res.status(404).json({ message: "Không có đối tác nào phù hợp" });
        }
        const result = partners.map(partner => ({
            maDoiTac: partner.maDoiTac,
            tenDoiTac: partner.tenDoiTac,
            tenQuocGia: partner.quocGia?.tenQuocGia || null, // Tránh lỗi khi không có quốc gia
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Lấy đối tác theo ID
export const getPartnerById = async (req, res) => {
    try {
        const { maDoiTac } = req.body;

        if (!maDoiTac) {
            return res.status(400).json({ message: "Thiếu mã đối tác" });
        }

        const partner = await DoiTac.findByPk(maDoiTac, {
            include: [{ model: QuocGia, as: "quocGia" }],
        });

        if (!partner) {
            return res.status(404).json({ message: "Đối tác không tồn tại" });
        }

        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Thêm đối tác mới
export const addPartner = async (req, res) => {
    try {
        const { maDoiTac, tenDoiTac, maQuocGia } = req.body;

        if (!maDoiTac || !tenDoiTac || !maQuocGia) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }
        const existingPartner = await DoiTac.findOne({ where: { maDoiTac } });
        if (existingPartner) {
            return res.status(409).json({ message: "Mã đối tác đã tồn tại!" });
        }

        const newPartner = await DoiTac.create({ maDoiTac, tenDoiTac, maQuocGia });

        res.status(201).json(newPartner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Cập nhật đối tác
export const updatePartner = async (req, res) => {
    try {
        
        const { maDoiTac,tenDoiTac, maQuocGia } = req.body;

        const partner = await DoiTac.findByPk(maDoiTac);
        if (!partner) {
            return res.status(404).json({ message: "Đối tác không tồn tại" });
        }

        partner.tenDoiTac = tenDoiTac || partner.tenDoiTac;
        partner.maQuocGia = maQuocGia || partner.maQuocGia;

        await partner.save();
        res.status(200).json({ message: "Cập nhật đối tác thành công", partner });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa đối tác
export const deletePartner = async (req, res) => {
    try {
        const { maDoiTac } = req.body;

        const partner = await DoiTac.findByPk(maDoiTac);
        if (!partner) {
            return res.status(404).json({ message: "Đối tác không tồn tại" });
        }

        await partner.destroy();
        res.status(200).json({ message: "Xóa đối tác thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
