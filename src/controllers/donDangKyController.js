import { DonDangKy } from "../models/donDangKyModel.js";
import { DonDK_SPDV } from "../models/donDK_SPDVMolel.js";
import { LichSuThamDinh } from "../models/lichSuThamDinhModel.js";
import { LoaiDon } from "../models/loaiDonModel.js";
import { NhanHieu } from "../models/nhanHieuModel.js";
import { TaiLieu } from "../models/taiLieuModel.js";
import { Op, literal } from "sequelize";
import { sendGenericNotification } from "../utils/notificationHelper.js";


export const getAllApplication = async (req, res) => {
    try {
        const { maSPDVList, maNhanHieu, trangThaiDon, searchText, fields = [], filterCondition = {} } = req.body;
        const whereCondition = {};

        if (maNhanHieu) whereCondition.maNhanHieu = maNhanHieu;
        if (trangThaiDon) whereCondition.trangThaiDon = trangThaiDon;

        if (searchText) {
            whereCondition[Op.and] = literal(`REPLACE(soDon, '-', '') LIKE '%${searchText}%'`);
        }

        const { selectedField, fromDate, toDate } = filterCondition;
        if (selectedField && fromDate && toDate) {
            whereCondition[selectedField] = {
                [Op.between]: [fromDate, toDate]
            };
        }

        if (fields.includes("trangThaiHoanThienHoSoTaiLieu")) {
            fields.push("taiLieuChuaNop");
            fields.push("ngayHoanThanhHoSoTaiLieu_DuKien");
        }

        // Bổ sung tự động hanXuLy nếu chưa có
        if (!fields.includes("hanXuLy")) {
            fields.push("hanXuLy");
        }

        const applications = await DonDangKy.findAll({
            where: whereCondition,
            include: [
                {
                    model: DonDK_SPDV,
                    where: maSPDVList && maSPDVList.length > 0 ? {
                        maSPDV: { [Op.in]: maSPDVList }
                    } : undefined,
                    required: maSPDVList && maSPDVList.length > 0
                },
                {
                    model: TaiLieu,
                    where: { trangThai: 'Chưa nộp' },
                    required: false,
                    as: 'taiLieuChuaNop',
                    attributes: ['tenTaiLieu']
                }
            ]
        });

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "Không có đơn đăng ký nào" });
        }

        const fieldMap = {
            maDonDangKy: app => app.maDonDangKy,
            maHoSoVuViec: app => app.maHoSoVuViec,
            soDon: app => app.soDon,
            maNhanHieu: app => app.maNhanHieu,
            trangThaiDon: app => app.trangThaiDon,
            ngayNopDon: app => app.ngayNopDon,
            ngayHoanThanhHoSoTaiLieu: app => app.ngayHoanThanhHoSoTaiLieu,
            ngayKQThamDinhHinhThuc: app => app.ngayKQThamDinhHinhThuc,
            ngayCongBoDon: app => app.ngayCongBoDon,
            ngayKQThamDinhND: app => app.ngayKQThamDinhND,
            ngayTraLoiKQThamDinhND: app => app.ngayTraLoiKQThamDinhND,
            ngayThongBaoCapBang: app => app.ngayThongBaoCapBang,
            ngayNopPhiCapBang: app => app.ngayNopPhiCapBang,
            ngayNhanBang: app => app.ngayNhanBang,
            soBang: app => app.soBang,
            ngayCapBang: app => app.ngayCapBang,
            ngayHetHanBang: app => app.ngayHetHanBang,
            ngayGuiBangChoKhachHang: app => app.ngayGuiBangChoKhachHang,
            trangThaiHoanThienHoSoTaiLieu: app => app.trangThaiHoanThienHoSoTaiLieu,
            ngayHoanThanhHoSoTaiLieu_DuKien: app => app.ngayHoanThanhHoSoTaiLieu_DuKien,
            taiLieuChuaNop: app => app.taiLieuChuaNop?.map(tl => ({ tenTaiLieu: tl.tenTaiLieu })) || [],

            hanXuLy: (app) => {
                let duKienDate = null;

                switch (app.trangThaiDon) {
                    case "Thẩm định nội dung":
                        duKienDate = app.ngayKQThamDinhND_DuKien;
                        break;
                    case "Hoàn thiện hồ sơ":
                        duKienDate = app.ngayHoanThanhHoSoTaiLieu_DuKien;
                        break;
                    case "Thẩm định hình thức":
                        duKienDate = app.ngayKQThamDinhHinhThuc_DuKien;
                        break;
                    case "Công bố đơn":
                        duKienDate = app.ngayCongBoDonDuKien
                        break;
                    default:
                        return null;
                }

                if (!duKienDate) return null;

                const today = new Date();
                const targetDate = new Date(duKienDate);

                if (isNaN(targetDate.getTime())) return null; // ngày không hợp lệ

                const diffTime = today - targetDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // số ngày

                return diffDays; // dương là trễ, âm là còn hạn
            }

        };

        const result = applications.map(app => {
            const row = {};
            fields.forEach(field => {
                if (fieldMap[field]) {
                    row[field] = fieldMap[field](app);
                }
            });
            return row;
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getApplicationById = async (req, res) => {
    try {
        const { maDonDangKy } = req.body;
        if (!maDonDangKy) return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });

        const don = await DonDangKy.findByPk(maDonDangKy, {
            include: [
                {
                    model: TaiLieu,
                    as: "taiLieu",
                    attributes: ["maTaiLieu", "tenTaiLieu", "linkTaiLieu", "trangThai"]
                },
                {
                    model: DonDK_SPDV,

                    attributes: ["maSPDV"]
                },
                {
                    model: NhanHieu,
                    as: "nhanHieu",
                    attributes: ["maNhanHieu", "tenNhanHieu", "linkAnh"]
                },
                {
                    model: LichSuThamDinh,
                    as: "lichSuThamDinh",
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']  // có thể tuỳ chọn ẩn nếu không cần
                    }
                }
            ]
        });

        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        const plainDon = don.toJSON();
        plainDon.lichSuThamDinhHT = [];
        plainDon.lichSuThamDinhND = [];

        if (Array.isArray(plainDon.lichSuThamDinh)) {
            for (const item of plainDon.lichSuThamDinh) {
                if (item.loaiThamDinh === "HinhThuc") {
                    plainDon.lichSuThamDinhHT.push(item);
                }
                else if (item.loaiThamDinh === "NoiDung") {
                    plainDon.lichSuThamDinhND.push(item);
                }
            }
        }
        delete plainDon.lichSuThamDinh;
        plainDon.maSPDVList = plainDon.DonDK_SPDVs.map(sp => sp.maSPDV);
        delete plainDon.DonDK_SPDVs;

        res.json(plainDon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createApplication = async (req, res) => {
    const transaction = await DonDangKy.sequelize.transaction();
    try {
        const { taiLieus, maHoSoVuViec, lichSuThamDinhHT, lichSuThamDinhND, maSPDVList, ...donData } = req.body;
        const maDonDangKy = `${maHoSoVuViec}`;
        const newDon = await DonDangKy.create({
            ...donData,
            maDonDangKy: maDonDangKy,
            maHoSoVuViec: maHoSoVuViec,
        }, { transaction });

        if (Array.isArray(taiLieus)) {
            for (const tl of taiLieus) {
                await TaiLieu.create({
                    maDonDangKy: newDon.maDonDangKy,
                    tenTaiLieu: tl.tenTaiLieu,
                    trangThai: tl.trangThai,
                    linkTaiLieu: tl.linkTaiLieu || null,
                }, { transaction });
            }
        }
        if (Array.isArray(maSPDVList)) {
            for (const maSPDV of maSPDVList) {
                await DonDK_SPDV.create({
                    maDonDangKy: newDon.maDonDangKy,
                    maSPDV: maSPDV,
                }, { transaction });
            }
        }
        if (Array.isArray(lichSuThamDinhHT)) {
            for (const item of lichSuThamDinhHT) {
                await LichSuThamDinh.create({
                    maDonDangKy,
                    loaiThamDinh: item.loaiThamDinh,
                    lanThamDinh: item.lanThamDinh,
                    ngayNhanThongBaoTuChoiTD: item.ngayNhanThongBaoTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ghiChu: item.ghiChu || null,
                    trangThaiBiNhanQuyetDinhTuChoi: item.trangThaiBiNhanQuyetDinhTuChoi || false,
                    ngayNhanQuyetDinhTuChoi: item.ngayNhanQuyetDinhTuChoi,

                    hanKhieuNaiCSHTT: item.hanKhieuNaiCSHTT,
                    ngayKhieuNaiCSHTT: item.ngayKhieuNaiCSHTT,
                    ketQuaKhieuNaiCSHTT: item.ketQuaKhieuNaiCSHTT,
                    ngayKQ_KN_CSHTT: item.ngayKQ_KN_CSHTT,
                    ghiChuKetQuaKNCSHTT: item.ghiChuKetQuaKNCSHTT,

                    hanKhieuNaiBKHCN: item.hanKhieuNaiBKHCN,
                    ngayKhieuNaiBKHCN: item.ngayKhieuNaiBKHCN,
                    ketQuaKhieuNaiBKHCN: item.ketQuaKhieuNaiBKHCN,
                    ngayKQ_KN_BKHCN: item.ngayKQ_KN_BKHCN,
                    ghiChuKetQuaKNBKHCN: item.ghiChuKetQuaKNBKHCN,

                    ngayNopYeuCCNDHLSauKN: item.ngayNopYeuCCNDHLSauKN
                }, { transaction });
            }
        }
        if (Array.isArray(lichSuThamDinhND)) {
            for (const item of lichSuThamDinhND) {
                await LichSuThamDinh.create({
                    maDonDangKy,
                    loaiThamDinh: item.loaiThamDinh,
                    lanThamDinh: item.lanThamDinh,
                    ngayNhanThongBaoTuChoiTD: item.ngayNhanThongBaoTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ghiChu: item.ghiChu || null,
                    trangThaiBiNhanQuyetDinhTuChoi: item.trangThaiBiNhanQuyetDinhTuChoi || false,
                    ngayNhanQuyetDinhTuChoi: item.ngayNhanQuyetDinhTuChoi,

                    hanKhieuNaiCSHTT: item.hanKhieuNaiCSHTT,
                    ngayKhieuNaiCSHTT: item.ngayKhieuNaiCSHTT,
                    ketQuaKhieuNaiCSHTT: item.ketQuaKhieuNaiCSHTT,
                    ngayKQ_KN_CSHTT: item.ngayKQ_KN_CSHTT,
                    ghiChuKetQuaKNCSHTT: item.ghiChuKetQuaKNCSHTT,

                    hanKhieuNaiBKHCN: item.hanKhieuNaiBKHCN,
                    ngayKhieuNaiBKHCN: item.ngayKhieuNaiBKHCN,
                    ketQuaKhieuNaiBKHCN: item.ketQuaKhieuNaiBKHCN_ND,
                    ngayKQ_KN_BKHCN: item.ngayKQ_KN_BKHCN,
                    ghiChuKetQuaKNBKHCN: item.ghiChuKetQuaKNBKHCN,

                    ngayNopYeuCCNDHLSauKN: item.ngayNopYeuCCNDHLSauKN
                }, { transaction });
            }
        }
        await transaction.commit();
        res.status(201).json({
            message: "Tạo đơn đăng ký và tài liệu thành công",
            don: newDon
        });

    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ message: error.message });
    }
};


export const updateApplication = async (req, res) => {
    const t = await DonDangKy.sequelize.transaction();
    try {
        const { maDonDangKy, taiLieus, maSPDVList, lichSuThamDinhHT, lichSuThamDinhND, maNhanHieu, maNhanSuCapNhap, ...updateData } = req.body;

        if (!maDonDangKy) {
            return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });
        }

        const don = await DonDangKy.findByPk(maDonDangKy);
        if (!don) {
            return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
        }
        const changedFields = [];
        if (maNhanSuCapNhap) {
            updateData.maNhanSuCapNhap = maNhanSuCapNhap;
        }
        for (const key in updateData) {
            if (
                updateData[key] !== undefined &&
                updateData[key] !== don[key]
            ) {
                changedFields.push({
                    field: key,
                    oldValue: don[key],
                    newValue: updateData[key],
                });
                don[key] = updateData[key];
            }
        }
        await don.update({ ...updateData, maNhanHieu }, { transaction: t });
        const taiLieusHienTai = await TaiLieu.findAll({
            where: { maDonDangKy },
            transaction: t
        });

        const maTaiLieusTruyenLen = taiLieus?.filter(tl => tl.maTaiLieu).map(tl => tl.maTaiLieu) || [];

        for (const taiLieuCu of taiLieusHienTai) {
            if (!maTaiLieusTruyenLen.includes(taiLieuCu.maTaiLieu)) {
                await taiLieuCu.destroy({ transaction: t });
            }
        }

        if (Array.isArray(taiLieus)) {
            for (const taiLieu of taiLieus) {
                if (taiLieu.maTaiLieu) {
                    await TaiLieu.update({
                        tenTaiLieu: taiLieu.tenTaiLieu,
                        linkTaiLieu: taiLieu.linkTaiLieu,
                        trangThai: taiLieu.trangThai,
                    }, {
                        where: { maTaiLieu: taiLieu.maTaiLieu },
                        transaction: t
                    });
                } else {
                    await TaiLieu.create({
                        tenTaiLieu: taiLieu.tenTaiLieu,
                        linkTaiLieu: taiLieu.linkTaiLieu,
                        trangThai: taiLieu.trangThai,
                        maDonDangKy: maDonDangKy
                    }, { transaction: t });
                }
            }
        }
        if (Array.isArray(maSPDVList)) {
            await DonDK_SPDV.destroy({
                where: { maDonDangKy },
                transaction: t
            });
            for (const maSPDV of maSPDVList) {
                await DonDK_SPDV.create({
                    maDonDangKy,
                    maSPDV
                }, { transaction: t });
            }
        }
        // if (Array.isArray(lichSuThamDinhHT) || Array.isArray(lichSuThamDinhND)) {
        //     await LichSuThamDinh.destroy({
        //         where: { maDonDangKy },
        //         transaction: t
        //     });
        // }
        if (Array.isArray(lichSuThamDinhHT) || Array.isArray(lichSuThamDinhND)) {
            await LichSuThamDinh.destroy({
                where: { maDonDangKy },
                transaction: t
            });
        }

        if (Array.isArray(lichSuThamDinhHT)) {
            for (const item of lichSuThamDinhHT) {
                await LichSuThamDinh.create({
                    maDonDangKy,
                    loaiThamDinh: item.loaiThamDinh,
                    lanThamDinh: item.lanThamDinh,
                    ngayNhanThongBaoTuChoiTD: item.ngayNhanThongBaoTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ghiChu: item.ghiChu || null,
                    trangThaiBiNhanQuyetDinhTuChoi: item.trangThaiBiNhanQuyetDinhTuChoi || false,
                    ngayNhanQuyetDinhTuChoi: item.ngayNhanQuyetDinhTuChoi,

                    hanKhieuNaiCSHTT: item.hanKhieuNaiCSHTT,
                    ngayKhieuNaiCSHTT: item.ngayKhieuNaiCSHTT,
                    ketQuaKhieuNaiCSHTT: item.ketQuaKhieuNaiCSHTT,
                    ngayKQ_KN_CSHTT: item.ngayKQ_KN_CSHTT,
                    ghiChuKetQuaKNCSHTT: item.ghiChuKetQuaKNCSHTT,

                    hanKhieuNaiBKHCN: item.hanKhieuNaiBKHCN,
                    ngayKhieuNaiBKHCN: item.ngayKhieuNaiBKHCN,
                    ketQuaKhieuNaiBKHCN: item.ketQuaKhieuNaiBKHCN,
                    ngayKQ_KN_BKHCN: item.ngayKQ_KN_BKHCN,
                    ghiChuKetQuaKNBKHCN: item.ghiChuKetQuaKNBKHCN,

                    ngayNopYeuCCNDHLSauKN: item.ngayNopYeuCCNDHLSauKN
                }, { transaction: t });
            }
        }

        if (Array.isArray(lichSuThamDinhND)) {
            for (const item of lichSuThamDinhND) {
                await LichSuThamDinh.create({
                    maDonDangKy,
                    loaiThamDinh: item.loaiThamDinh,
                    lanThamDinh: item.lanThamDinh,
                    ngayNhanThongBaoTuChoiTD: item.ngayNhanThongBaoTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ghiChu: item.ghiChu || null,
                    trangThaiBiNhanQuyetDinhTuChoi: item.trangThaiBiNhanQuyetDinhTuChoi || false,
                    ngayNhanQuyetDinhTuChoi: item.ngayNhanQuyetDinhTuChoi,

                    hanKhieuNaiCSHTT: item.hanKhieuNaiCSHTT,
                    ngayKhieuNaiCSHTT: item.ngayKhieuNaiCSHTT,
                    ketQuaKhieuNaiCSHTT: item.ketQuaKhieuNaiCSHTT,
                    ngayKQ_KN_CSHTT: item.ngayKQ_KN_CSHTT,
                    ghiChuKetQuaKNCSHTT: item.ghiChuKetQuaKNCSHTT,

                    hanKhieuNaiBKHCN: item.hanKhieuNaiBKHCN,
                    ngayKhieuNaiBKHCN: item.ngayKhieuNaiBKHCN,
                    ketQuaKhieuNaiBKHCN: item.ketQuaKhieuNaiBKHCN,
                    ngayKQ_KN_BKHCN: item.ngayKQ_KN_BKHCN,
                    ghiChuKetQuaKNBKHCN: item.ghiChuKetQuaKNBKHCN,

                    ngayNopYeuCCNDHLSauKN: item.ngayNopYeuCCNDHLSauKN
                }, { transaction: t });
            }
        }
        if (changedFields.length > 0) {
            await sendGenericNotification({
                maNhanSuCapNhap,
                title: "Cập nhập đơn đăng ký",
                bodyTemplate: (tenNhanSu) =>
                    `${tenNhanSu} đã cập nhập đơn đăng ký'${don.soDon || don.maDonDangKy}'`,
                data: {
                    maDonDangKy,
                    changes: changedFields,
                },
            });

        }

        await t.commit();
        res.json({ message: "Cập nhật đơn thành công", data: don });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ message: error.message });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const { maDonDangKy, maNhanSuCapNhap } = req.body;

        if (!maDonDangKy) {
            return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });
        }

        const don = await DonDangKy.findByPk(maDonDangKy);
        if (!don) {
            return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
        }
        await TaiLieu.destroy({ where: { maDon: maDonDangKy } });
        await don.destroy();
        await sendGenericNotification({
            maNhanSuCapNhap,
            title: "Xóa đơn đăng ký",
            bodyTemplate: (tenNhanSu) =>
                `${tenNhanSu} đã xóa đơn đăng ký '${don.soDon}'`,
            data: {},
        });
        res.status(200).json({ message: "Đã xoá đơn đăng ký và tài liệu liên quan" });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Đơn đăng ký đang được sử dụng, không thể xóa." });
        }

        res.status(500).json({ message: error.message });
    }
};


