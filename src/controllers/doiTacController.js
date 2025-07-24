import { Op } from "sequelize";
import { DoiTac } from "../models/doiTacModel.js";
import { QuocGia } from "../models/quocGiaModel.js";
import { sendGenericNotification } from "../utils/notificationHelper.js";
import { Sequelize } from "sequelize";
export const getPartners = async (req, res) => {
    try {
        const { tenDoiTac, maQuocGia, pageIndex = 1, pageSize = 20 } = req.body;
        const offset = (pageIndex - 1) * pageSize;

        const whereCondition = {};
        if (tenDoiTac) whereCondition.tenDoiTac = { [Op.like]: `%${tenDoiTac}%` };
        if (maQuocGia) whereCondition.maQuocGia = maQuocGia;

        const totalItems = await DoiTac.count({ where: whereCondition });

        const partners = await DoiTac.findAll({
            where: whereCondition,
            attributes: ["id", "maDoiTac", "tenDoiTac"],
            include: [
                {
                    model: QuocGia,
                    as: "quocGia",
                    attributes: ["tenQuocGia"],
                },
            ],
            limit: pageSize,
            offset: offset,
        });

        if (!partners.length) {
            return res.status(404).json({ message: "Không có đối tác nào phù hợp" });
        }

        const result = partners.map(partner => ({
            id: partner.id,
            maDoiTac: partner.maDoiTac,
            tenDoiTac: partner.tenDoiTac,
            tenQuocGia: partner.quocGia?.tenQuocGia || null,
        }));

        res.status(200).json({
            data: result,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize),
                pageIndex: Number(pageIndex),
                pageSize: Number(pageSize)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllPartners = async (req, res) => {
    try {
        const partners = await DoiTac.findAll({
            attributes: ["maDoiTac", "tenDoiTac"],
            order: [["tenDoiTac", "ASC"]],
        });

        if (!partners.length) {
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
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Thiếu id đối tác" });
        }

        const partner = await DoiTac.findByPk(id, {
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
        if (error instanceof Sequelize.UniqueConstraintError) {
            let message = "Dữ liệu đã tồn tại";
            const field = error.errors[0].path;
            if (field === "tenDoiTac") message = "Tên đối tác đã tồn tại.";
            return res.status(409).json({ message });
        }
        res.status(500).json({ message: error.message });
    }
};


// Cập nhật đối tác
export const updatePartner = async (req, res) => {
    try {
        const { id, maDoiTac, tenDoiTac, maQuocGia, maNhanSuCapNhap } = req.body;

        const partner = await DoiTac.findByPk(id);
        if (!partner) {
            return res.status(404).json({ message: "Đối tác không tồn tại" });
        }

        const changedFields = [];

        // Cập nhật mã đối tác
        if (maDoiTac !== undefined && maDoiTac !== partner.maDoiTac) {
            changedFields.push({ field: "maDoiTac", oldValue: partner.maDoiTac, newValue: maDoiTac });
            partner.maDoiTac = maDoiTac;
        }

        // Cập nhật tên đối tác
        if (tenDoiTac !== undefined && tenDoiTac !== partner.tenDoiTac) {
            changedFields.push({ field: "tenDoiTac", oldValue: partner.tenDoiTac, newValue: tenDoiTac });
            partner.tenDoiTac = tenDoiTac;
        }

        // Cập nhật quốc gia
        if (maQuocGia !== undefined && maQuocGia !== partner.maQuocGia) {
            changedFields.push({ field: "maQuocGia", oldValue: partner.maQuocGia, newValue: maQuocGia });
            partner.maQuocGia = maQuocGia;
        }

        partner.maNhanSuCapNhap = maNhanSuCapNhap;
        await partner.save({ userId: maNhanSuCapNhap });

        // Gửi thông báo nếu có thay đổi
        if (changedFields.length > 0) {
            await sendGenericNotification({
                maNhanSuCapNhap,
                title: "Cập nhật đối tác",
                bodyTemplate: (tenNhanSu) =>
                    `${tenNhanSu} đã cập nhật đối tác '${partner.tenDoiTac}'`,
                data: {
                    maDoiTac: partner.maDoiTac,
                    changes: changedFields
                }
            });
        }

        res.status(200).json({ message: "Cập nhật đối tác thành công", partner, changes: changedFields });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            let message = "Dữ liệu đã tồn tại";
            const field = error.errors[0].path;
            if (field === "tenDoiTac") message = "Tên đối tác đã tồn tại.";
            if (field === "maDoiTac") message = "Mã đối tác đã tồn tại.";
            return res.status(409).json({ message });
        }
        res.status(500).json({ message: error.message });
    }
};


// Xóa đối tác
export const deletePartner = async (req, res) => {
    try {
        const { id, maNhanSuCapNhap } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Thiếu id đối tác" });
        }

        const partner = await DoiTac.findByPk(id);

        if (!partner) {
            return res.status(404).json({ message: "Đối tác không tồn tại" });
        }
        await partner.destroy();
        await sendGenericNotification({
            maNhanSuCapNhap,
            title: "Xóa đối tác",
            bodyTemplate: (tenNhanSu) =>
                `${tenNhanSu} đã xóa đối tác '${partner.tenDoiTac}'`,
            data: { id: id, maDoiTac: partner.maDoiTac },
        });
        res.status(200).json({ message: "Xóa đối tác thành công" });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Đối tác đang được sử dụng, không thể xóa." });
        }
        res.status(500).json({ message: error.message });
    }
};
