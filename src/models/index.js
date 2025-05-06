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
import { DonDangKy } from "./donDangKyModel.js";
import { TaiLieu } from "./taiLieuModel.js";
import { Auth } from "./authModel.js";
import { NhanHieu } from "./nhanHieuModel.js";
import { SanPham_DichVu } from "./sanPham_DichVuModel.js";
import { HopDongVuViec } from "./hopDongVuViecModel.js";
import { LichSuThamDinh } from "./lichSuThamDinhModel.js";
// import { DonDangKy_BuocXuLy } from "./donDangKy_BuocXuLyModel.js";
// import { DonDangKy_QuyTrinhDKNH } from "./donDangKy_QuyTrinhDKNH.js";
import { DonDK_SPDV } from "./donDK_SPDVMolel.js";

Auth.belongsTo(NhanSu, {
    foreignKey: 'maNhanSu',
    targetKey: 'maNhanSu',
    as: 'nhanSu',
});

NhanSu.hasOne(Auth, {
    foreignKey: 'maNhanSu',
    sourceKey: 'maNhanSu', 
    as: 'Auth',
});

// ========= Quan hệ QuocGia và DoiTac =========
QuocGia.hasMany(DoiTac, { foreignKey: "maQuocGia", as: "doiTac" });
DoiTac.belongsTo(QuocGia, { foreignKey: "maQuocGia", as: "quocGia" });

// ========= Quan hệ KhachHangCuoi =========
KhachHangCuoi.belongsTo(DoiTac, { foreignKey: "maDoiTac", targetKey: "maDoiTac", as: "doiTac" });
KhachHangCuoi.belongsTo(QuocGia, { foreignKey: "maQuocGia", targetKey: "maQuocGia", as: "quocGia" });
KhachHangCuoi.belongsTo(NganhNghe, { foreignKey: "maNganhNghe", targetKey: "maNganhNghe", as: "nganhNghe" });

// ========= Quan hệ HoSo_VuViec với các bảng khác =========
// HoSo_VuViec - KhachHangCuoi
HoSo_VuViec.belongsTo(KhachHangCuoi, { foreignKey: "maKhachHang", targetKey: "maKhachHang", as: "khachHang" });
KhachHangCuoi.hasMany(HoSo_VuViec, { foreignKey: "maKhachHang", as: "hoSoVuViec" });

// HoSo_VuViec - DoiTac
HoSo_VuViec.belongsTo(DoiTac, { foreignKey: "maDoiTac", targetKey: "maDoiTac", as: "doiTac" });
DoiTac.hasMany(HoSo_VuViec, { foreignKey: "maDoiTac", as: "hoSoVuViec" });

// HoSo_VuViec - LoaiVuViec
HoSo_VuViec.belongsTo(LoaiVuViec, { foreignKey: "maLoaiVuViec", targetKey: "maLoaiVuViec", as: "loaiVuViec" });
LoaiVuViec.hasMany(HoSo_VuViec, { foreignKey: "maLoaiVuViec", as: "hoSoVuViec" });

// HoSo_VuViec - QuocGia
HoSo_VuViec.belongsTo(QuocGia, { foreignKey: "maQuocGiaVuViec", targetKey: "maQuocGia", as: "quocGia" });
QuocGia.hasMany(HoSo_VuViec, { foreignKey: "maQuocGiaVuViec", as: "hoSoVuViec" });

HoSo_VuViec.belongsTo(LoaiDon, { foreignKey: "maLoaiDon", targetKey: "maLoaiDon", as: "loaiDon" });
LoaiDon.hasMany(HoSo_VuViec, { foreignKey: "maLoaiDon", as: "hoSoVuViec" });

HoSo_VuViec.hasMany(NhanSu_VuViec, {
    foreignKey: "maHoSoVuViec",
    as: "nhanSuXuLy" // Alias dùng trong include
});
NhanSu_VuViec.belongsTo(HoSo_VuViec, {
    foreignKey: "maHoSoVuViec"
});
NhanSu_VuViec.belongsTo(NhanSu, {
    foreignKey: "maNhanSu",
    as: "nhanSu"  // **Quan trọng: Phải trùng với alias trong truy vấn**
});
// // HoSo_VuViec - NhanSu (Người tạo hồ sơ vụ việc)
// HoSo_VuViec.belongsTo(NhanSu, { foreignKey: "maNguoiTao", targetKey: "maNhanSu", as: "nguoiTao" });
// NhanSu.hasMany(HoSo_VuViec, { foreignKey: "maNguoiTao", as: "hoSoVuViec" });

// // HoSo_VuViec - NhanSu_VuViec (Nhiều-nhiều giữa nhân sự và vụ việc)
// HoSo_VuViec.belongsToMany(NhanSu, { through: NhanSu_VuViec, foreignKey: "maHoSoVuViec", as: "nhanSu" });
// NhanSu.belongsToMany(HoSo_VuViec, { through: NhanSu_VuViec, foreignKey: "maNhanSu", as: "hoSoVuViec" });

//Quan hệ 1 nhiều giữa loại đơn và đơn
LoaiDon.hasMany(DonDangKy, { foreignKey: "maLoaiDon", as: "loaiDon" })
DonDangKy.belongsTo(LoaiDon, { foreignKey: "maLoaiDon", as: "loaiDon" })

DonDangKy.hasMany(TaiLieu, { foreignKey: "maDonDangKy", as: "taiLieu", onDelete: 'CASCADE', hooks: true });
TaiLieu.belongsTo(DonDangKy, { foreignKey: "maDonDangKy", as: "donDangKy" });

DonDangKy.hasMany(DonDK_SPDV, { foreignKey: "maDonDangKy", onDelete: 'CASCADE', hooks: true });
DonDK_SPDV.belongsTo(DonDangKy, { foreignKey: "maDonDangKy" });

DonDangKy.belongsTo(NhanHieu, {
    foreignKey: "maNhanHieu",
    as: "nhanHieu"
});
NhanHieu.hasMany(DonDangKy, {
    foreignKey: "maNhanHieu"
});

DonDangKy.hasMany(LichSuThamDinh, { foreignKey: "maDonDangKy", as: "lichSuThamDinh", });
LichSuThamDinh.belongsTo(DonDangKy, { foreignKey: "maDonDangKy" });
export const syncDatabase = async () => {
    await sequelize.sync();
    console.log("✅ Database synchronized with all models");
};
