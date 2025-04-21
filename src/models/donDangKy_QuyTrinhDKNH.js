import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { DonDangKy } from "./donDangKyModel.js";

export const DonDangKy_QuyTrinhDKNH = sequelize.define("DonDangKy_QuyTrinhDKNH", {
    maDonDangKy_QuyTrinh: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    maDonDangKy: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: DonDangKy,
            key: 'maDonDangKy'
        }
    },
    ngayNopDon: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ngayHoanThanhHoSoTaiLieuDuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayHoanThanhHoSoTaiLieuDuKien: {
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
    ngayKQTraLoiThamDinhHinhThuc_DuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayKQTraLoiThamDinhHinhThuc: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayTraLoiTuChoiThamDinhHinhThuc:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayGiaHanTraLoiTuChoiThamDinhHinhThuc:{
        type: DataTypes.DATE,
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
    ngayThamDinhNoiDungDuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayKetQuaThamDinhNoiDung: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayKQTraLoiThamDinhND_DuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayKQTraLoiThamDinhND: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayTraLoiTuChoiThamDinhNoiDung:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayGiaHanTraLoiTuChoiThamDinhNoiDung:{
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
    }
}, {
    timestamps: true,
    tableName: "DonDangKy_QuyTrinhDKNH",
});
