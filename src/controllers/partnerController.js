import { Partner } from "../models/partnerModel.js";

// Lấy danh sách đối tác
export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.findAll();
        if (partners.length === 0) {
            return res.status(404).json({ message: "Không có đối tác nào" });
        }
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy đối tác theo ID
export const getPartnerById = async (req, res) => {
    try {
        const partner = await Partner.findByPk(req.params.id);
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
        const { partnerName } = req.body;

        if (!partnerName) {
            return res.status(400).json({ message: "Tên đối tác là bắt buộc" });
        }

        const newPartner = await Partner.create({ partnerName });
        res.status(201).json(newPartner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật đối tác
export const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const { partnerName } = req.body;

        const partner = await Partner.findByPk(id);
        if (!partner) {
            return res.status(404).json({ message: "Đối tác không tồn tại" });
        }

        partner.partnerName = partnerName;

        await partner.save();

        res.status(200).json({ message: "Cập nhật đối tác thành công", partner });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa đối tác
export const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await Partner.findByPk(id);

        if (!partner) {
            return res.status(404).json({ message: "Đối tác không tồn tại" });
        }

        await partner.destroy();
        res.status(200).json({ message: "Xóa đối tác thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
