import { Sequelize, Op } from "sequelize";

import { HoSo_VuViec } from "../models/hoSoVuViecModel.js";
import { KhachHangCuoi } from "../models/khanhHangCuoiModel.js";
import { DoiTac } from "../models/doiTacModel.js";
import { QuocGia } from "../models/quocGiaModel.js";
import { LoaiVuViec } from "../models/loaiVuViecModel.js";
import { NhanSu_VuViec } from "../models/nhanSu_VuViecModel.js";
import { NhanSu } from "../models/nhanSuModel.js";

export const searchCases = async (req, res) => {
    try {
        const { maKhachHang, maDoiTac, maLoaiVuViec, maQuocGia, searchText } = req.body;
        
        const whereCondition = {};
        if (maLoaiVuViec) whereCondition.maLoaiVuViec = maLoaiVuViec;
        if (maQuocGia) whereCondition.maQuocGiaVuViec = maQuocGia;
        if (maKhachHang) whereCondition.maKhachHang = maKhachHang;
        if (maDoiTac) whereCondition.maDoiTac = maDoiTac;
        if (searchText) whereCondition.noiDungVuViec = { [Op.like]: `%${searchText}%` };

        const cases = await HoSo_VuViec.findAll({
            where: whereCondition,
            attributes: [
                "maHoSoVuViec",
                "noiDungVuViec",
                "trangThaiVuViec",
                "buocXuLyHienTai",
                "ngayTiepNhan",
                "ngayTao",
                "ngayCapNhap"
            ],
            include: [
                { model: KhachHangCuoi, as: "khachHang", attributes: ["tenKhachHang"] },
                { model: DoiTac, as: "doiTac", attributes: ["tenDoiTac"] },
                { model: QuocGia, as: "quocGia", attributes: ["tenQuocGia"] },
                { model: LoaiVuViec, as: "loaiVuViec", attributes: ["tenLoaiVuViec"] },
                { 
                    model: NhanSu_VuViec, 
                    as: "nhanSuXuLy", 
                    attributes: ["vaiTro", "ngayGiaoVuViec"],
                    include: [
                        { model: NhanSu, as: "nhanSu", attributes: ["hoTen"] }
                    ]
                }
            ]
        });
        console.log("Dữ liệu case:", cases);
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
                ngayTao: hoSo.ngayTao,
                ngayCapNhap: hoSo.ngayCapNhap,
                tenKhachHang: hoSo.khachHang?.tenKhachHang || null,
                tenDoiTac: hoSo.doiTac?.tenDoiTac || null,
                tenQuocGia: hoSo.quocGia?.tenQuocGia || null,
                tenLoaiVuViec: hoSo.loaiVuViec?.tenLoaiVuViec || null,
                nhanSuXuLy
            };
        });

        res.status(200).json(formattedCases);
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
        const { maHoSoVuViec } = req.body;
        const caseToUpdate = await HoSo_VuViec.findByPk(maHoSoVuViec);
        if (!caseToUpdate) return res.status(404).json({ message: "Hồ sơ vụ việc không tồn tại" });
        
        await caseToUpdate.update(req.body);
        res.status(200).json({ message: "Cập nhật hồ sơ vụ việc thành công", caseToUpdate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCase = async (req, res) => {
    try {
        const { maHoSoVuViec } = req.body;
        const caseToDelete = await HoSo_VuViec.findByPk(maHoSoVuViec);
        if (!caseToDelete) return res.status(404).json({ message: "Hồ sơ vụ việc không tồn tại" });
        await caseToDelete.destroy();
        res.status(200).json({ message: "Xóa hồ sơ vụ việc thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCaseDetail = async (req, res) => {
    try {
        const { maHoSoVuViec } = req.body;

        const caseDetail = await HoSo_VuViec.findByPk(maHoSoVuViec, {
            include: [
                { model: KhachHangCuoi, as: "khachHang", attributes: ["tenKhachHang"] },
                { model: DoiTac, as: "doiTac", attributes: ["tenDoiTac"] },
                { model: QuocGia, as: "quocGia", attributes: ["tenQuocGia"] },
                { model: LoaiVuViec, as: "loaiVuViec", attributes: ["tenLoaiVuViec"] },
            ],
        });

        if (!caseDetail) {
            return res.status(404).json({ message: "Hồ sơ vụ việc không tồn tại" });
        }

        res.status(200).json(caseDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

