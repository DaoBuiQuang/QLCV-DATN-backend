import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { HoSo_VuViec } from "./hoSoVuViecModel.js";
import { LoaiDon } from "./loaiDonModel.js";


export const DonDangKy = sequelize.define("DonDangKy", {
    maDonDangKy: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    soDon: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    maHoSoVuViec: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: HoSo_VuViec,
            key: "maHoSoVuViec",
        },
    },
    maLoaiDon: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: LoaiDon,
            key: "maLoaiDon",
        },
    },
    ngayNopDon: {
        type: DataTypes.DATE,
        allowNull: false,
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
    },
    trangThaiDon: {
        type: DataTypes.STRING,
        allowNull: false,
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
