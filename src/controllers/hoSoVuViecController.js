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

export const searchCases = async (req, res) => {
    try {
        const { maKhachHang, maDoiTac, maLoaiVuViec, maQuocGia, maLoaiDon, searchText } = req.body;

        const whereCondition = {};
        if (maLoaiVuViec) whereCondition.maLoaiVuViec = maLoaiVuViec;
        if (maQuocGia) whereCondition.maQuocGiaVuViec = maQuocGia;
        if (maKhachHang) whereCondition.maKhachHang = maKhachHang;
        if (maDoiTac) whereCondition.maDoiTac = maDoiTac;
        if (maLoaiDon) whereCondition.maLoaiDon = maDoiTac;
        if (searchText) whereCondition.noiDungVuViec = { [Op.like]: `%${searchText}%` };

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
            ]
        });
        // console.log("Dữ liệu case:", cases);
        const formattedCases = cases.map(hoSo => {
            const nhanSuXuLy = hoSo.nhanSuXuLy?.map(ns => {
                return {
                    tenNhanSu: ns.nhanSu?.hoTen || "Không xác định",
                    vaiTro: ns.vaiTro,
                    ngayGiaoVuViec: ns.ngayGiaoVuViec
                };
            }) || [];


            return {
                maHoSoVuViec: hoSo.maHoSoVuViec,
                noiDungVuViec: hoSo.noiDungVuViec,
                trangThaiVuViec: hoSo.trangThaiVuViec,
                buocXuLyHienTai: hoSo.buocXuLyHienTai,
                ngayTiepNhan: hoSo.ngayTiepNhan,
                ngayTao: hoSo.createdAt,
                ngayCapNhap: hoSo.updatedAt,
                tenKhachHang: hoSo.khachHang?.tenKhachHang || null,
                tenDoiTac: hoSo.doiTac?.tenDoiTac || null,
                tenQuocGia: hoSo.quocGia?.tenQuocGia || null,
                tenLoaiVuViec: hoSo.loaiVuViec?.tenLoaiVuViec || null,
                tenLoaiDon: hoSo.LoaiDon?.tenKhachHang || null,
                maDonDangKy: hoSo.donDangKy?.[0]?.maDonDangKy || null,
                nhanSuXuLy
            };
        });

        res.status(200).json(formattedCases);
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
        const { maHoSoVuViec, nhanSuVuViec, ...updateData } = req.body;

        const caseToUpdate = await HoSo_VuViec.findByPk(maHoSoVuViec);
        if (!caseToUpdate) return res.status(404).json({ message: "Hồ sơ vụ việc không tồn tại" });

        updateData.ngayCapNhat = new Date();
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

        res.status(200).json({ message: "Cập nhật hồ sơ vụ việc thành công", caseToUpdate });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



export const deleteCase = async (req, res) => {
    try {
        const { maHoSoVuViec } = req.body;
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
                // { model: KhachHangCuoi, as: "khachHang", attributes: ["tenKhachHang"] },
                // { model: DoiTac, as: "doiTac", attributes: ["tenDoiTac"] },
                // { model: QuocGia, as: "quocGia", attributes: ["tenQuocGia"] },
                // { model: LoaiVuViec, as: "loaiVuViec", attributes: ["tenLoaiVuViec"] },
                // { model: LoaiDon, as: "loaiDon", attributes: ["tenLoaiDon"] },
                {
                    model: NhanSu_VuViec,
                    as: "nhanSuXuLy",
                    attributes: ["maNhanSu", "vaiTro"],
                    include: [
                        { model: NhanSu, as: "nhanSu", attributes: [] }
                    ]
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

        res.status(200).json({
            ...caseDetail.toJSON(),
            nhanSuXuLy
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};