import { sequelize } from "../config/db.js";
import { NganhNghe } from "./nganhNgheModel.js";
import { QuocGia } from "./quocGiaModel.js";
import { DoiTac } from "./doitacModel.js";
import { KhachHangCuoi } from "./khanhHangCuoiModel.js";
import { LoaiVuViec } from "./loaiVuViecModel.js";
import { NhanSu } from "./nhanSuModel.js";
import { HoSo_VuViec } from "./hoSoVuViecModel.js";
import { NhanSu_VuViec } from "./nhanSu_VuViecFileModel.js";
import { LoaiDon } from "./loaiDonModel.js";
import { DonDangKy } from "./donDangKiModel.js";
import { TaiLieu } from "./taiLieuModel.js";
import { Auth } from "./authModel.js";
import { HopDongVuViec } from "./hopDongVuViecModel.js";
export const syncDatabase = async () => {
    await sequelize.sync(); 
    console.log("✅ Database synchronized with all models");
};
