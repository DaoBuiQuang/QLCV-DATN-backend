import { sequelize } from "../config/db.js";
import { NganhNghe } from "./nganhNgheModel.js";
import { QuocGia } from "./quocGiaModel.js";
import { DoiTac } from "./doiTacModel.js";
import { KhachHangCuoi } from "./khanhHangCuoiModel.js";
import { LoaiVuViec } from "./loaiVuViecModel.js";
import { NhanSu } from "./nhanSuModel.js";
import { HoSo_VuViec } from "./hoSoVuViecModel.js";
import { NhanSu_VuViec } from "./nhanSu_VuViecModel.js";
import { LoaiDon } from "./loaiDonModel.js";
import { DonDangKy } from "./donDangKiModel.js";
import { TaiLieu } from "./taiLieuModel.js";
import { Auth } from "./authModel.js";
import { HopDongVuViec } from "./hopDongVuViecModel.js";

// ========= Quan hệ QuocGia và DoiTac =========
QuocGia.hasMany(DoiTac, { foreignKey: "maQuocGia", as: "doiTac" });
DoiTac.belongsTo(QuocGia, { foreignKey: "maQuocGia", as: "quocGia" });

// ========= Quan hệ KhachHangCuoi =========
KhachHangCuoi.belongsTo(DoiTac, { foreignKey: "maDoiTac", targetKey: "maDoiTac", as: "doiTac" });
KhachHangCuoi.belongsTo(QuocGia, { foreignKey: "maQuocGia", targetKey: "maQuocGia", as: "quocGia" });
KhachHangCuoi.belongsTo(NganhNghe, { foreignKey: "maNganhNghe", targetKey: "maNganhNghe", as: "nganhNghe" });

// ========= Các quan hệ khác (nếu cần thêm) =========
// Tiếp tục thêm các quan hệ khác giống như trên khi bạn cần

export const syncDatabase = async () => {
    await sequelize.sync();
    console.log("✅ Database synchronized with all models");
};
