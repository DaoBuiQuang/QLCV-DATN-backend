import { Sequelize, Op } from "sequelize";

import { HoSo_VuViec } from "../models/hoSoVuViecModel.js";
import { KhachHangCuoi } from "../models/khanhHangCuoiModel.js";
import { DoiTac } from "../models/doiTacModel.js";
import { QuocGia } from "../models/quocGiaModel.js";
import { LoaiVuViec } from "../models/loaiVuViecModel.js";
import { NhanSu_VuViec } from "../models/nhanSu_VuViecModel.js";
import { NhanSu } from "../models/nhanSuModel.js";
import { LoaiDon } from "../models/loaiDonModel.js";
import { DonDangKy } from "../models/donDangKyModel.js";
import { sendGenericNotification } from "../utils/notificationHelper.js";

export const searchCases = async (req, res) => {
    try {
        const { maKhachHang, maDoiTac, maLoaiVuViec, maQuocGia, maLoaiDon, searchText, fields = [], pageIndex = 1, pageSize = 20 } = req.body;
        const offset = (pageIndex - 1) * pageSize;
        const whereCondition = {};
        if (maLoaiVuViec) whereCondition.maLoaiVuViec = maLoaiVuViec;
        if (maQuocGia) whereCondition.maQuocGiaVuViec = maQuocGia;
        if (maKhachHang) whereCondition.maKhachHang = maKhachHang;
        if (maDoiTac) whereCondition.maDoiTac = maDoiTac;
        if (maLoaiDon) whereCondition.maLoaiDon = maDoiTac;
        if (searchText) whereCondition.noiDungVuViec = { [Op.like]: `%${searchText}%` };
        const totalItems = await HoSo_VuViec.count({ where: whereCondition });
        const cases = await HoSo_VuViec.findAll({
            where: whereCondition,
            attributes: [
                "maHoSoVuViec",
                "noiDungVuViec",
                "trangThaiVuViec",
                "buocXuLyHienTai",
                "ngayTiepNhan",
                "createdAt",
                "updatedAt"
            ],
            include: [
                { model: KhachHangCuoi, as: "khachHang", attributes: ["tenKhachHang"] },
                { model: DoiTac, as: "doiTac", attributes: ["tenDoiTac"] },
                { model: QuocGia, as: "quocGia", attributes: ["tenQuocGia"] },
                { model: LoaiVuViec, as: "loaiVuViec", attributes: ["tenLoaiVuViec"] },
                { model: LoaiDon, as: "loaiDon", attributes: ["tenLoaiDon"] },
                {
                    model: NhanSu_VuViec,
                    as: "nhanSuXuLy",
                    attributes: ["vaiTro", "ngayGiaoVuViec"],
                    include: [
                        { model: NhanSu, as: "nhanSu", attributes: ["hoTen"] }
                    ]
                },
                {
                    model: DonDangKy,
                    as: "donDangKy",
                    attributes: ["maDonDangKy"]

                }
            ],
            limit: pageSize,
            offset: offset
        });
        if (!cases.length) {
            return res.status(404).json({ message: "Không tìm thấy vụ việc nào" });
        }
        // console.log("Dữ liệu case:", cases);
        const fieldMap = {
            maHoSoVuViec: hoSo => hoSo.maHoSoVuViec,
            noiDungVuViec: hoSo => hoSo.noiDungVuViec,
            trangThaiVuViec: hoSo => hoSo.trangThaiVuViec,
            buocXuLyHienTai: hoSo => hoSo.buocXuLyHienTai,
            ngayTiepNhan: hoSo => hoSo.ngayTiepNhan,
            ngayTao: hoSo => hoSo.createdAt,
            ngayCapNhap: hoSo => hoSo.updatedAt,
            tenKhachHang: hoSo => hoSo.khachHang?.tenKhachHang || null,
            tenDoiTac: hoSo => hoSo.doiTac?.tenDoiTac || null,
            tenQuocGia: hoSo => hoSo.quocGia?.tenQuocGia || null,
            tenLoaiVuViec: hoSo => hoSo.loaiVuViec?.tenLoaiVuViec || null,
            tenLoaiDon: hoSo => hoSo.loaiDon?.tenLoaiDon || null,
            maDonDangKy: hoSo => hoSo.donDangKy?.maDonDangKy || null,
            nhanSuXuLy: hoSo => hoSo.nhanSuXuLy?.map(ns => ({
                tenNhanSu: ns.nhanSu?.hoTen || "Không xác định",
                vaiTro: ns.vaiTro,
                ngayGiaoVuViec: ns.ngayGiaoVuViec
            })) || []
        };

        const result = cases.map(hoSo => {
            const row = {};
            fields.forEach(field => {
                if (fieldMap[field]) {
                    row[field] = fieldMap[field](hoSo);
                }
            });
            return row;
        });

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
export const generateCaseCode = async (req, res) => {
    try {
        const { maKhachHang } = req.body;

        if (!maKhachHang) {
            return res.status(400).json({ message: "Thiếu mã khách hàng" });
        }
        const count = await HoSo_VuViec.count({
            where: { maKhachHang }
        });

        const stt = (count + 1).toString().padStart(4, '0');
        const maHoSoVuViec = `${maKhachHang}-${stt}`;

        res.status(200).json({
            message: "Tạo mã hồ sơ vụ việc thành công",
            maHoSoVuViec
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addCase = async (req, res) => {
    try {
        const { nhanSuVuViec, ...caseData } = req.body;

        caseData.ngayTao = caseData.ngayTao || new Date();

        const newCase = await HoSo_VuViec.create(caseData);

        if (nhanSuVuViec && nhanSuVuViec.length > 0) {
            const nhanSuData = nhanSuVuViec.map((ns) => ({
                maHoSoVuViec: newCase.maHoSoVuViec,
                maNhanSu: ns.maNhanSu,
                vaiTro: ns.vaiTro,
                ngayGiaoVuViec: ns.ngayGiaoVuViec || new Date(),
            }));

            await NhanSu_VuViec.bulkCreate(nhanSuData);
        }

        res.status(201).json({ message: "Thêm hồ sơ vụ việc thành công", newCase });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ message: error.errors.map(e => e.message) });
        }
        res.status(500).json({ message: error.message });
    }
};



export const updateCase = async (req, res) => {
    try {
        const { maHoSoVuViec, nhanSuVuViec, maNhanSuCapNhap, ...updateData } = req.body;

        const caseToUpdate = await HoSo_VuViec.findByPk(maHoSoVuViec);
        if (!caseToUpdate) return res.status(404).json({ message: "Hồ sơ vụ việc không tồn tại" });
        const changedFields = [];
        if (maNhanSuCapNhap) {
            updateData.maNhanSuCapNhap = maNhanSuCapNhap;
        }
        for (const key in updateData) {
            if (
                updateData[key] !== undefined &&
                updateData[key] !== caseToUpdate[key]
            ) {
                changedFields.push({
                    field: key,
                    oldValue: caseToUpdate[key],
                    newValue: updateData[key],
                });
                caseToUpdate[key] = updateData[key];
            }
        }
        await caseToUpdate.update(updateData);

        if (nhanSuVuViec && nhanSuVuViec.length > 0) {
            for (const ns of nhanSuVuViec) {
                await NhanSu_VuViec.update(
                    { vaiTro: 'Thay thế' },
                    {
                        where: {
                            maHoSoVuViec,
                            vaiTro: ns.vaiTro,
                            maNhanSu: { [Op.ne]: ns.maNhanSu }
                        }
                    }
                );
                const existing = await NhanSu_VuViec.findOne({
                    where: {
                        maHoSoVuViec,
                        maNhanSu: ns.maNhanSu
                    }
                });

                if (existing) {
                    await existing.update({
                        vaiTro: ns.vaiTro,
                        ngayGiaoVuViec: ns.ngayGiaoVuViec || new Date()
                    });
                } else {
                    await NhanSu_VuViec.create({
                        maHoSoVuViec,
                        maNhanSu: ns.maNhanSu,
                        vaiTro: ns.vaiTro,
                        ngayGiaoVuViec: ns.ngayGiaoVuViec || new Date()
                    });
                }
            }
        }

        if (changedFields.length > 0) {
            await sendGenericNotification({
                maNhanSuCapNhap,
                title: "Cập nhật hồ sơ vụ việc",
                bodyTemplate: (tenNhanSu) =>
                    `${tenNhanSu} đã cập nhật hồ sơ vụ việc '${caseToUpdate.tenVuViec || caseToUpdate.maHoSoVuViec}'`,
                data: {
                    maHoSoVuViec,
                    changes: changedFields,
                },
            });

        }

        res.status(200).json({ message: "Cập nhật hồ sơ vụ việc thành công", caseToUpdate });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



export const deleteCase = async (req, res) => {
    try {
        const { maHoSoVuViec, maNhanSuCapNhap } = req.body;
        if (!maHoSoVuViec) {
            return res.status(400).json({ message: "Thiếu mã hồ sơ vụ việc" });
        }
        const caseToDelete = await HoSo_VuViec.findByPk(maHoSoVuViec);
        if (!caseToDelete) {
            return res.status(404).json({ message: "Hồ sơ vụ việc không tồn tại" });
        }
        await NhanSu_VuViec.destroy({
            where: { maHoSoVuViec }
        });
        await caseToDelete.destroy();
        await sendGenericNotification({
            maNhanSuCapNhap,
            title: "Xóa hồ sơ vụ việc",
            bodyTemplate: (tenNhanSu) =>
                `${tenNhanSu} đã xóa hồ sơ vụ việc'${caseToDelete.tenVuViec}'`,
            data: {},
        });
        res.status(200).json({ message: "Xóa hồ sơ vụ việc thành công" });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Hồ sơ vụ việc đang được sử dụng, không thể xóa." });
        }

        res.status(500).json({ message: error.message });
    }
};



export const getCaseDetail = async (req, res) => {
    try {
        const { maHoSoVuViec } = req.body;

        const caseDetail = await HoSo_VuViec.findByPk(maHoSoVuViec, {
            include: [
                {
                    model: NhanSu_VuViec,
                    as: "nhanSuXuLy",
                    attributes: ["maNhanSu", "vaiTro"],
                    include: [
                        { model: NhanSu, as: "nhanSu", attributes: [] }
                    ]
                },
                {
                    model: DonDangKy,
                    as: "donDangKy",
                    attributes: ["maDonDangKy"]

                }
            ],
        });

        if (!caseDetail) {
            return res.status(404).json({ message: "Hồ sơ vụ việc không tồn tại" });
        }
        const nhanSuXuLy = caseDetail.nhanSuXuLy?.map(ns => ({
            maNhanSu: ns.maNhanSu,
            vaiTro: ns.vaiTro
        })) || [];

        const result = caseDetail.toJSON();
        delete result.donDangKy;

        res.status(200).json({
            ...result,
            nhanSuXuLy,
            maDonDangKy: caseDetail.donDangKy?.maDonDangKy || null
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};