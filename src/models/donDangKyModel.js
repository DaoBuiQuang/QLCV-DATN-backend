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
    maNhanHieu:{
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
     // Các trường quy trình đã gộp vào DonDangKy
    ngayNopDon: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayHoanThanhHoSoTaiLieu_DuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayHoanThanhHoSoTaiLieu: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    trangThaiHoanThienHoSoTaiLieu: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayKQThamDinhHinhThuc_DuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayKQThamDinhHinhThuc: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayTraLoiKQTuChoiThamDinhHinhThuc:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    giaHanTraLoiKQTuChoiThamDinhHinhThuc:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    ngayCongBoDonDuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayCongBoDon: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayKQThamDinhND_DuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayKQThamDinhND: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayTraLoiKQTuChoiThamDinhND:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    giaHanTraLoiKQTuChoiThamDinhNoiDung:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    ngayTraLoiKQThamDinhND_DuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayTraLoiKQThamDinhND: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayThongBaoCapBang: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayNopPhiCapBang: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayNhanBang: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayGuiBangChoKhachHang: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    soBang: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayCapBang: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayHetHanBang: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "DonDangKy",
});
