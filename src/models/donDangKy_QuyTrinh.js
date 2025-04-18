import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";



export const DonDangKy_QuyTrinh = sequelize.define("DonDangKy_QuyTrinh", {
    maDonDangKy_TrangThai: {
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
    ngayHoanThanhHoSoTaiLieu: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    trangThaiHoanThienHoSoTaiLieu: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayQuyetDinhDonHopLeDuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayQuyetDinhDonHopLe: {
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
    ngayTraLoiKetQuaThamDinhNoiDungDuKien: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ngayTraLoiKetQuaThamDinhNoiDung: {
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
    tableName: "DonDangKy_QuyTrinh",
});
