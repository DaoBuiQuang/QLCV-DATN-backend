import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { KhachHangCuoi } from "./khanhHangCuoiModel.js";
import { DoiTac } from "./doitacModel.js";
import { NhanSu } from "./nhanSuModel.js";
import { QuocGia } from "./quocgiaModel.js";
import { LoaiVuViec } from "./loaiVuViecModel.js";


export const HoSo_VuViec = sequelize.define("HoSo_VuViec", {
    maHoSoVuViec: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    maKhachHang: {
        type: DataTypes.STRING,
        allowNull: true,
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
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    ngayXuLy: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    maLoaiVuViec: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: LoaiVuViec,
            key: "maLoaiVuViec",
        },
    },
    maQuocGiaVuViec: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: QuocGia,
            key: "maQuocGia",
        },
    },
    trangThaiVuViec: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayTao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    ngayCapNhap: {
        type: DataTypes.DATE,
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
    timestamps: false,
    tableName: "HoSo_VuViec",
});
