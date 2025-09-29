import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { NhanHieu } from "./nhanHieuModel.js";
import { KhachHangCuoi } from "./khanhHangCuoiModel.js";
import { DoiTac } from "./doiTacModel.js";
import { NhanSu } from "./nhanSuModel.js";

export const GCN_NH = sequelize.define("GCN_NH", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
     soBang: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    maDonDangKy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    soDon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
   

    idKhachHang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: KhachHangCuoi,
            key: "id",
        },
    },
    idDoiTac: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: DoiTac,
            key: "id",
        },
    },
    maHoSo: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    clientsRef: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    maNhanHieu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: NhanHieu,
            key: "maNhanHieu",
        },
    },
    maQuocGia:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    trangThaiDon: {
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

    ngayCapBang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayHetHanBang: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    quyetDinhSo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    maNhanSuCapNhap: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dsNhomSPDV: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    performedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    daXoa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    loaiBang:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    mauSacNH:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    chiTietNhomSPDV:{
        type:DataTypes.TEXT,
        allowNull: true,
    },
    anhBang:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
    bangGoc:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    maNguoiXuLy1: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: NhanSu,
            key: "maNhanSu",
        },
    },
    maNguoiXuLy2: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: NhanSu,
            key: "maNhanSu",
        },
    },
    isAutoImport: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false = nhập tay, true = nhập máy
        comment: 'Phân biệt dữ liệu nhập tay hoặc nhập tự động'
    }
}, {
    timestamps: true,
    tableName: "GCN_NH",
});
