import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { KhachHangCuoi } from "./khanhHangCuoiModel.js";
import { DoiTac } from "./doiTacModel.js";
import { NhanSu } from "./nhanSuModel.js";
import { QuocGia } from "./quocGiaModel.js";
import { LoaiVuViec } from "./loaiVuViecModel.js";
import { LoaiDon } from "./loaiDonModel.js";


export const HoSo_VuViec = sequelize.define("HoSo_VuViec", {
    maHoSoVuViec: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    maKhachHang: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: KhachHangCuoi,
            key: "maKhachHang",
        },
    },
    maDoiTac: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: DoiTac,
            key: "maDoiTac",
        },
    },
    noiDungVuViec: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ngayTiepNhan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    ngayXuLy: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    maLoaiVuViec: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: LoaiVuViec,
            key: "maLoaiVuViec",
        },
    },
    maLoaiDon: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: LoaiDon,
            key: "maLoaiDon",
        },
    },
    maQuocGiaVuViec: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: QuocGia,
            key: "maQuocGia",
        },
    },
    trangThaiVuViec: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    buocXuLyHienTai: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    maNguoiTao: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: NhanSu,
            key: "maNhanSu",
        },
    },
}, {
    timestamps: true,
    tableName: "HoSo_VuViec",
});
