import { Op } from "sequelize";
import { DoiTac } from "../models/doiTacModel.js";
import { QuocGia } from "../models/quocGiaModel.js";
import { sendGenericNotification } from "../utils/notificationHelper.js";
import { Sequelize } from "sequelize";
import { GCN_NH } from "../models/GCN_NHModel.js";
import { NhanHieu } from "../models/nhanHieuModel.js";
import { KhachHangCuoi } from "../models/khanhHangCuoiModel.js";
export const getGCN_NHs = async (req, res) => {
    try {
        const { soBang, pageIndex = 1, pageSize = 20 } = req.body;
        const offset = (pageIndex - 1) * pageSize;

        const whereCondition = {};
        if (soBang) whereCondition.soBang = { [Op.like]: `%${soBang}%` };

        const totalItems = await GCN_NH.count({ where: whereCondition });

        const GCN_NHs = await GCN_NH.findAll({
            where: whereCondition,
            attributes: ["id", "soBang", "soDon", "maHoSo", "ngayNopDon", "ngayCapBang", "ghiChu","dsNhomSPDV" ],
            include: [
                {
                    model: NhanHieu,
                    as: "NhanHieu",
                    attributes: ["tenNhanHieu"],
                },
                {
                    model: KhachHangCuoi,
                    as: "KhachHangCuoi",
                    attributes: ["tenKhachHang"],
                },
                {
                    model: DoiTac,
                    as: "DoiTac",
                    attributes: ["tenDoiTac"],
                },
            ],
            limit: pageSize,
            offset: offset,
        });


        if (!GCN_NHs.length) {
            return res.status(404).json({ message: "Không có bằng nào phù hợp" });
        }

        const result = GCN_NHs.map(gcn_nh => ({
            id: gcn_nh.id,
            soBang: gcn_nh.soBang,
            soDon: gcn_nh.soDon,
            maHoSo: gcn_nh.soBang,
            tenKhachHang: gcn_nh.KhachHangCuoi?.tenKhachHang || "",
            tenDoiTac: gcn_nh.DoiTac?.tenDoiTac || "",
            tenNhanHieu: gcn_nh.NhanHieu?.tenNhanHieu || "",
            clientRef: gcn_nh.clientRef,
            ngayNopDon: gcn_nh.ngayNopDon,
            ngayCapBang: gcn_nh.ngayCapBang,
            ghiChu: gcn_nh.ghiChu,
            dsNhomSPDV: gcn_nh.dsNhomSPDV,

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

export const getGCN_NHDetail = async (req, res) => {
    try {
        const { id } = req.body;

        const gcn_nh = await GCN_NH.findOne({
            where: { id },
            attributes: [
                "id",
                "soBang",
                "soDon",
                "maHoSo",
                "ngayNopDon",
                "ngayCapBang",
                "ghiChu",
                "dsNhomSPDV",
                "chiTietNhomSPDV",
                "mauSacNH",
                "anhBang",

            ],
            include: [
                {
                    model: NhanHieu,
                    as: "NhanHieu",
                    attributes: ["tenNhanHieu", "linkAnh"],
                },
                {
                    model: KhachHangCuoi,
                    as: "KhachHangCuoi",
                    attributes: ["tenKhachHang", "diaChi"],
                },
                {
                    model: DoiTac,
                    as: "DoiTac",
                    attributes: ["tenDoiTac"],
                },
            ],
        });

        if (!gcn_nh) {
            return res.status(404).json({ message: "Không tìm thấy bằng này" });
        }
        console.log("gcn_nh:",gcn_nh)
        const result = {
            id: gcn_nh.id,
            soBang: gcn_nh.soBang,
            soDon: gcn_nh.soDon,
            maHoSo: gcn_nh.maHoSo,
            tenKhachHang: gcn_nh.KhachHangCuoi?.tenKhachHang || "",
            diaChiKhachHang: gcn_nh.KhachHangCuoi?.diaChi || "",
            tenDoiTac: gcn_nh.DoiTac?.tenDoiTac || "",
            tenNhanHieu: gcn_nh.NhanHieu?.tenNhanHieu || "",
            linkAnh:gcn_nh.NhanHieu?.linkAnh || null,
            clientRef: gcn_nh.clientRef,
            ngayNopDon: gcn_nh.ngayNopDon,
            ngayCapBang: gcn_nh.ngayCapBang,
            ghiChu: gcn_nh.ghiChu,
            dsNhomSPDV: gcn_nh.dsNhomSPDV,
            chiTietNhomSPDV: gcn_nh.chiTietNhomSPDV,
            mauSacNH: gcn_nh.mauSacNH,
            anhBang: gcn_nh.anhBang
        };

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
