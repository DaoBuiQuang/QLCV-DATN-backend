// controllers/giayUyQuyenController.js
import { Op, Sequelize } from "sequelize";

import { sendGenericNotification } from "../utils/notificationHelper.js";
import { GiayUyQuyen } from "../models/GiayUyQuyenModel.js";

// 📄 Lấy danh sách giấy ủy quyền (phân trang + tìm kiếm)
export const getGiayUyQuyen = async (req, res) => {
    try {
        const {
            soDonGoc,
            idKhachHang,
            idDoiTac,
            pageIndex = 1,
            pageSize = 20,
        } = req.body;

        const offset = (pageIndex - 1) * pageSize;
        const whereCondition = {};

        if (soDonGoc) {
            whereCondition.soDonGoc = { [Op.like]: `%${soDonGoc}%` };
        }
        if (idKhachHang) {
            whereCondition.idKhachHang = idKhachHang;
        }
        if (idDoiTac) {
            whereCondition.idDoiTac = idDoiTac;
        }

        const totalItems = await GiayUyQuyen.count({ where: whereCondition });

        const list = await GiayUyQuyen.findAll({
            where: whereCondition,
            attributes: [
                "id",
                "idKhachHang",
                "idDoiTac",
                "maQuocGia",
                "soDonGoc",
                "ngayUyQuyen",
                "ngayHetHan",
                "linkAnh",
                "ghiChu",
                "maNhanSuCapNhap",
                "createdAt",
                "updatedAt",
            ],
            order: [["ngayUyQuyen", "DESC"]],
            limit: pageSize,
            offset,
        });

        if (!list.length) {
            return res
                .status(404)
                .json({ message: "Không có giấy ủy quyền nào phù hợp" });
        }

        res.status(200).json({
            data: list,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize),
                pageIndex: Number(pageIndex),
                pageSize: Number(pageSize),
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📋 Lấy toàn bộ giấy ủy quyền
export const getAllGiayUyQuyen = async (req, res) => {
    try {
        const list = await GiayUyQuyen.findAll({
            attributes: [
                "id",
                "idKhachHang",
                "idDoiTac",
                "maQuocGia",
                "soDonGoc",
                "ngayUyQuyen",
                "ngayHetHan",
                "linkAnh",
                "ghiChu",
                "maNhanSuCapNhap",
                "createdAt",
                "updatedAt",
            ],
            order: [["ngayUyQuyen", "DESC"]],
        });

        if (!list.length) {
            return res
                .status(404)
                .json({ message: "Không có giấy ủy quyền nào" });
        }

        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔍 Lấy giấy ủy quyền theo ID
export const getGiayUyQuyenById = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res
                .status(400)
                .json({ message: "Thiếu id giấy ủy quyền" });
        }

        const record = await GiayUyQuyen.findByPk(id);

        if (!record) {
            return res
                .status(404)
                .json({ message: "Giấy ủy quyền không tồn tại" });
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ➕ Thêm giấy ủy quyền mới
export const addGiayUyQuyen = async (req, res) => {
    try {
        const {
            idKhachHang,
            idDoiTac,
            maQuocGia,
            soDonGoc,
            ngayUyQuyen,
            ngayHetHan,
            linkAnh,
            ghiChu,
            maNhanSuCapNhap,
        } = req.body;

        if (!idKhachHang) {
            return res
                .status(400)
                .json({ message: "Thiếu id khách hàng" });
        }

        // Nếu có ràng unique soDonGoc thì có thể check trùng ở đây
        if (soDonGoc) {
            const existing = await GiayUyQuyen.findOne({
                where: { soDonGoc },
            });
            if (existing) {
                return res
                    .status(409)
                    .json({ message: "Số đơn gốc đã tồn tại!" });
            }
        }

        const newRecord = await GiayUyQuyen.create({
            idKhachHang,
            idDoiTac,
            maQuocGia,
            soDonGoc,
            ngayUyQuyen,
            ngayHetHan,
            linkAnh,
            ghiChu,
            maNhanSuCapNhap,
        });

        res.status(201).json(newRecord);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            let message = "Dữ liệu đã tồn tại";
            const field = error.errors[0].path;
            if (field === "soDonGoc") message = "Số đơn gốc đã tồn tại.";
            return res.status(409).json({ message });
        }
        res.status(500).json({ message: error.message });
    }
};

// ✏️ Cập nhật giấy ủy quyền
export const updateGiayUyQuyen = async (req, res) => {
    try {
        const {
            id,
            idKhachHang,
            idDoiTac,
            maQuocGia,
            soDonGoc,
            ngayUyQuyen,
            ngayHetHan,
            linkAnh,
            ghiChu,
            maNhanSuCapNhap,
        } = req.body;

        const record = await GiayUyQuyen.findByPk(id);
        if (!record) {
            return res
                .status(404)
                .json({ message: "Giấy ủy quyền không tồn tại" });
        }

        const changedFields = [];

        const updateField = (field, newValue) => {
            if (newValue !== undefined && newValue !== record[field]) {
                changedFields.push({
                    field,
                    oldValue: record[field],
                    newValue,
                });
                record[field] = newValue;
            }
        };

        updateField("idKhachHang", idKhachHang);
        updateField("idDoiTac", idDoiTac);
        updateField("maQuocGia", maQuocGia);
        updateField("soDonGoc", soDonGoc);
        updateField("ngayUyQuyen", ngayUyQuyen);
        updateField("ngayHetHan", ngayHetHan);
        updateField("linkAnh", linkAnh);
        updateField("ghiChu", ghiChu);

        record.maNhanSuCapNhap = maNhanSuCapNhap;

        await record.save({ userId: maNhanSuCapNhap });

        if (changedFields.length > 0) {
            await sendGenericNotification({
                maNhanSuCapNhap,
                title: "Cập nhật giấy ủy quyền",
                bodyTemplate: (tenNhanSu) =>
                    `${tenNhanSu} đã cập nhật giấy ủy quyền${record.soDonGoc ? ` số '${record.soDonGoc}'` : ""}`,
                data: { id: record.id, soDonGoc: record.soDonGoc, changes: changedFields },
            });
        }

        res.status(200).json({
            message: "Cập nhật giấy ủy quyền thành công",
            giayUyQuyen: record,
            changes: changedFields,
        });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            let message = "Dữ liệu đã tồn tại";
            const field = error.errors[0].path;
            if (field === "soDonGoc") message = "Số đơn gốc đã tồn tại.";
            return res.status(409).json({ message });
        }
        res.status(500).json({ message: error.message });
    }
};

// 🗑️ Xóa giấy ủy quyền
export const deleteGiayUyQuyen = async (req, res) => {
    try {
        const { id, maNhanSuCapNhap } = req.body;

        if (!id) {
            return res
                .status(400)
                .json({ message: "Thiếu id giấy ủy quyền" });
        }

        const record = await GiayUyQuyen.findByPk(id);
        if (!record) {
            return res
                .status(404)
                .json({ message: "Giấy ủy quyền không tồn tại" });
        }

        await record.destroy();

        await sendGenericNotification({
            maNhanSuCapNhap,
            title: "Xóa giấy ủy quyền",
            bodyTemplate: (tenNhanSu) =>
                `${tenNhanSu} đã xóa giấy ủy quyền${record.soDonGoc ? ` số '${record.soDonGoc}'` : ""}`,
            data: { id: record.id, soDonGoc: record.soDonGoc },
        });

        res.status(200).json({ message: "Xóa giấy ủy quyền thành công" });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({
                message: "Giấy ủy quyền đang được sử dụng, không thể xóa.",
            });
        }
        res.status(500).json({ message: error.message });
    }
};
