import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { HoSo_VuViec } from "./hoSoVuViecModel.js";
import { NhanHieu } from "./nhanHieuModel.js";


export const DonDangKy = sequelize.define("DonDangKy", {
    maDonDangKy: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    soDon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    maHoSoVuViec: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: HoSo_VuViec,
            key: "maHoSoVuViec",
        },
    },
    maNhanHieu: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: NhanHieu,
            key: "maNhanHieu",
        },
    },
    trangThaiDon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hanXuLy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    buocXuLy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayNopDon: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayHoanThanhHoSoTaiLieu_DuKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayHoanThanhHoSoTaiLieu: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    trangThaiHoanThienHoSoTaiLieu: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayKQThamDinhHinhThuc_DuKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayKQThamDinhHinhThuc_DK_SauKN: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayKQThamDinhHinhThuc: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayCongBoDonDuKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayCongBoDon: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayKQThamDinhND_DuKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayKQThamDinhND_DK_SauKN: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayKQThamDinhND: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    trangThaiTraLoiKQThamDinhND: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    ngayTraLoiKQThamDinhND_DuKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayTraLoiKQThamDinhND: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayThongBaoCapBang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    trangThaiDYTBCapBang: {
        type: DataTypes.ENUM(
            'TOAN_BO',
            'MOT_PHAN'
        ),
        allowNull: true,
    },
    ngayNopYKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayNhanKQYKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ketQuaYKien: {
        type: DataTypes.ENUM(
            'THOA_DANG',
            'KHONG_THOA_DANG'
        ),
        allowNull: true,
    },
    ngayPhanHoiKQYKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayNopPhiCapBang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayNhanBang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayGuiBangChoKhachHang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    soBang: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayCapBang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayHetHanBang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    maNhanSuCapNhap: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "DonDangKy",
});
