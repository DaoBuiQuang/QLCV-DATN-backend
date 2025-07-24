import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { HoSo_VuViec } from "./hoSoVuViecModel.js";
import { NhanHieu } from "./nhanHieuModel.js";

export const DonDangKy = sequelize.define("DonDangKy", {
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    // },
    maDonDangKy: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    soDon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    maHoSoVuViec: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: {
            model: HoSo_VuViec,
            key: "maHoSoVuViec",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    },

    maNhanHieu: {
        type: DataTypes.INTEGER,
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
    hanTraLoi: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    hanXuLy: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    buocXuLy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ghiChu: {
        type: DataTypes.TEXT,
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
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    ///
    hanNopYKien: {
        type: DataTypes.DATEONLY,
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
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    hanNopPhiCapBang: {
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
    quyetDinhSo: {
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
    daXoa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: true,
    tableName: "DonDangKyNhanHieu",
});
