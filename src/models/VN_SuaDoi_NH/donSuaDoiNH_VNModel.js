import { DataTypes } from "sequelize";
// import { sequelize } from "../../../config/db.js";
import { sequelize } from "../../config/db.js";
import { HoSo_VuViec } from "../hoSoVuViecModel.js";
import { NhanHieu } from "../nhanHieuModel.js";
import { KhachHangCuoi } from "../khanhHangCuoiModel.js";
import { DoiTac } from "../doiTacModel.js";
import { DonDangKy } from "../donDangKyModel.js";

export const DonSuaDoi_NH_VN = sequelize.define("DonSuaDoi_NH_VN", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    maDonDangKy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DonDangKy,
            key: "maDonDangKy",
        },
    },
    soDon:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayYeuCau: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    suaDoiDaiDien: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    suaDoiTenChuDon: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    suaDoiDiaChi: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    suaNhan: {
        type: DataTypes.BOOLEAN,
        allowNull: true,

    },
    suaNhomSPDV: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    suaDoiNoiDungKhac: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    moTa:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ngayGhiNhanSuaDoi: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    duocGhiNhanSuaDoi: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    lanSuaDoi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Lần sửa đổi, mặc định lần đầu là 0, lần sửa đổi đầu tiên là 1, lần sửa đổi thứ hai là 2,...'
    },
    maNhanSuCapNhap: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isAutoImport: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false = nhập tay, true = nhập máy
        comment: 'Phân biệt dữ liệu nhập tay hoặc nhập tự động'
    }
}, {
    timestamps: true,
    tableName: "DonSuaDoi_NH_VN",
});
