import { Op } from "sequelize";
import { HoSo_VuViec } from "../models/hoSoVuViecModel.js";
import { KhachHangCuoi } from "../models/khanhHangCuoiModel.js";
import { DoiTac } from "../models/doiTacModel.js";
import { QuocGia } from "../models/quocGiaModel.js";
import { LoaiVuViec } from "../models/loaiVuViecModel.js";

export const searchCases = async (req, res) => {
    try {
        const { tenKhachHang, tenDoiTac, maLoaiVuViec, maQuocGia, searchText } = req.body;
        
        const whereCondition = {};
        if (maLoaiVuViec) whereCondition.maLoaiVuViec = maLoaiVuViec;
        if (maQuocGia) whereCondition.maQuocGiaVuViec = maQuocGia;
        if (searchText) whereCondition.noiDungVuViec = { [Op.like]: `%${searchText}%` };

        const cases = await HoSo_VuViec.findAll({
            where: whereCondition,
            include: [
                { model: KhachHangCuoi, as: "khachHang", where: tenKhachHang ? { tenKhachHang: { [Op.like]: `%${tenKhachHang}%` } } : undefined, attributes: ["tenKhachHang"] },
                { model: DoiTac, as: "doiTac", where: tenDoiTac ? { tenDoiTac: { [Op.like]: `%${tenDoiTac}%` } } : undefined, attributes: ["tenDoiTac"] },
                { model: QuocGia, as: "quocGia", attributes: ["tenQuocGia"] },
                { model: LoaiVuViec, as: "loaiVuViec", attributes: ["tenLoaiVuViec"] },
            ],
        });

        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addCase = async (req, res) => {
    try {
        const newCase = await HoSo_VuViec.create(req.body);
        res.status(201).json(newCase);
    } catch (error) {
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
// Lấy chi tiết hồ sơ vụ việc
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

