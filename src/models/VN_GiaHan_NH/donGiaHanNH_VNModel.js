import { DataTypes } from "sequelize";
// import { sequelize } from "../../../config/db.js";
import { sequelize } from "../../config/db.js";
import { HoSo_VuViec } from "../hoSoVuViecModel.js";
import { NhanHieu } from "../nhanHieuModel.js";
import { KhachHangCuoi } from "../khanhHangCuoiModel.js";
import { DoiTac } from "../doiTacModel.js";

export const DonGiaHan_NH_VN = sequelize.define("DonGiaHan_NH_VN", {
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    // },
    maDonGiaHan: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
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
    clientsRef: {
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
    trangThaiVuViec: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ngayDongHS: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayRutHS: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    maHoSo: {

        type: DataTypes.TEXT,
        allowNull: true,
    },
    soDon: {
        type: DataTypes.STRING,
        allowNull: true,
    },


    maHoSoVuViec: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    linkTaiLieu: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    ngayNopYCGiaHan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },

    donGoc: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    ngayKQThamDinh_DuKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    trangThaiThamDinh: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    ngayKQThamDinh: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayThongBaoTuChoiGiaHan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    hanTraLoiTuChoiGiaHan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayTraLoiThongBaoTuChoiGiaHan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    trangThaiTuChoiGiaHan: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    ngayQuyetDinhTuChoiGiaHan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayQuyetDinhGiaHan_DuKien: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayQuyetDinhGiaHan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ngayDangBa: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    ///
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
    isAutoImport: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false = nhập tay, true = nhập máy
        comment: 'Phân biệt dữ liệu nhập tay hoặc nhập tự động'
    }
}, {
    timestamps: true,
    tableName: "DonGiaHan_NH_VN",
});
