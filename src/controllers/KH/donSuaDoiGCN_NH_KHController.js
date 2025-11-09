// controllers/NH_VN_SD/donSuaDoi_NH_VNController.js
import { sequelize } from "../../config/db.js";
import { DonDangKy } from "../../models/donDangKyModel.js";
import { KhachHangCuoi } from "../../models/khanhHangCuoiModel.js";
import { DonSuaDoi_NH_VN } from "../../models/VN_SuaDoi_NH/donSuaDoiNH_VNModel.js";
import { DonDK_SPDV } from "../../models/donDK_SPDVMolel.js"
import crypto from "crypto";
import { GCN_NH } from "../../models/GCN_NHModel.js";
import { DonSuaDoiGCN_NH_VN } from "../../models/VN_SuaDoi_NH/donSuaDoiGCN_NH_VNModel.js";
import { GCN_NH_KH } from "../../models/GCN_NH_KHModel.js";
import { DonSuaDoiGCN_NH_KH } from "../../models/KH_SuaDoi_NH/donSuaDoiGCN_NH_KHModel.js";
// const generateMaDonDangKy = (maHoSo) => {
//     const randomStr = crypto.randomBytes(3).toString("hex"); // 6 ký tự hex
//     return `${maHoSo}_${randomStr}`;
// };

// 🧩 Hàm sinh mã khách hàng mới từ mã cũ
function generateNewMaKhachHang(maCu) {
    // Nếu chưa có hậu tố (chưa từng sửa) → thêm "-A"
    if (!maCu.includes("-")) {
        return `${maCu}-A`;
    }

    // Nếu đã có hậu tố, tách phần gốc và hậu tố ra
    const [prefix, suffix] = maCu.split("-");

    // Nếu hậu tố là 1 ký tự chữ cái (A, B, C,...)
    if (/^[A-Z]$/.test(suffix)) {
        const nextChar = String.fromCharCode(suffix.charCodeAt(0) + 1);
        return `${prefix}-${nextChar}`;
    }

    // Trường hợp đặc biệt (nhiều chữ, sai định dạng) → fallback
    return `${maCu}-A`;
}

export const addApplicationSD_GCN_NHKH = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            maHoSo,
            idGCN_NH_Cu,
            soDonSD,
            ngayYeuCau,
            lanSuaDoi,
            ngayGhiNhanSuaDoi,
            duocGhiNhanSuaDoi,
            moTaSuaDoi,
            suaDoiDaiDien,
            ndSuaDoiDaiDien,
            suaDoiTenChuBang,
            ndSuaDoiTenChuBang,
            suaDoiDiaChi,
            ndSuaDoiDiaChi,
            suaNhan,
            ndSuaNhan,
            suaNhomSPDV,
            ndSuaNhomSPDV,
        } = req.body;

        // ====== VALIDATE INPUT ======
        if (!maHoSo || !idGCN_NH_Cu) {
            return res
                .status(400)
                .json({ message: "Thiếu thông tin bắt buộc (mã hồ sơ, mã đơn, số đơn)." });
        }

        // ====== TÌM ĐƠN ĐĂNG KÝ CŨ ======
        const gcnCu = await GCN_NH_KH.findOne({ where: { id: idGCN_NH_Cu } });
        if (!gcnCu) {
            return res.status(404).json({ message: "Không tìm thấy giấy chứng nhận gốc." });
        }

        let idKhachHangMoi = gcnCu.idKhachHang;

        // ====== XỬ LÝ SỬA ĐỔI KHÁCH HÀNG ======
        if (suaDoiTenChuBang || suaDoiDiaChi) {
            const khachCu = await KhachHangCuoi.findByPk(gcnCu.idKhachHang);

            if (!khachCu) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng của đơn gốc." });
            }
            const maKhachHangMoi = generateNewMaKhachHang(khachCu.maKhachHang);
            const khachMoi = await KhachHangCuoi.create(
                {
                    tenKhachHang: suaDoiTenChuBang ? ndSuaDoiTenChuBang : khachCu.tenKhachHang,
                    diaChi: suaDoiDiaChi ? ndSuaDoiDiaChi : khachCu.diaChi,
                    email: khachCu.email,
                    maKhachHang: maKhachHangMoi,
                    maKhachHangCu: khachCu.maKhachHang,
                    sdt: khachCu.sdt,
                    maSoThue: khachCu.maSoThue,
                    maQuocGia: khachCu.maQuocGia,
                    nguoiLienHe: khachCu.nguoiLienHe,
                    ghiChu: khachCu.ghiChu,
                    tenVietTatKH: khachCu.tenVietTatKH,
                    maDoiTac: khachCu.maDoiTac,
                    moTa: khachCu.moTa,
                    maNganhNghe: khachCu.maNganhNghe,
                },
                { transaction }
            );

            idKhachHangMoi = khachMoi.id;
        }
        // ====== TẠO BẢN GHI ĐƠN MỚI ======
        const gcnData = gcnCu.toJSON();
        delete gcnData.id;
        delete gcnData.createdAt;
        delete gcnData.updatedAt;

        const gcnMoi = await GCN_NH_KH.create(
            {
                ...gcnData,
                loaiBang: 2, // bằng sửa đổi
                idKhachHang: idKhachHangMoi,
                bangGoc: 0, // bằng sửa đổi mới giữ 0
                idGCN_NH_Goc: idGCN_NH_Cu,
                ngayNop: ngayYeuCau,
            },
            { transaction }
        );

        await gcnCu.update({ bangGoc: 1 }, { transaction });
        const newSD = await DonSuaDoiGCN_NH_KH.create(
            {
                maHoSo,
                idGCN_NH_Goc: idGCN_NH_Cu,
                soDonSD,
                idGCN_NH: gcnMoi.id,
                ngayYeuCau,
                lanSuaDoi,
                ngayGhiNhanSuaDoi,
                duocGhiNhanSuaDoi,
                moTaSuaDoi,
                suaDoiDaiDien,
                ndSuaDoiDaiDien,
                suaDoiTenChuBang,
                ndSuaDoiTenChuBang,
                suaDoiDiaChi,
                ndSuaDoiDiaChi,
                suaNhan,
                ndSuaNhan,
                suaNhomSPDV,
                ndSuaNhomSPDV,
            },
            { transaction }
        );

        await transaction.commit();

        res.status(201).json({
            message: "Thêm đơn sửa đổi thành công!",
            gcnMoi,
            newSD,
        });
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        console.error("❌ Lỗi thêm đơn sửa đổi:", error);
        res.status(500).json({ message: error.message });
    }

};
