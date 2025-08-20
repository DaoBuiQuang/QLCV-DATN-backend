import { NhanHieu } from "../../models/nhanHieuModel.js";
// import { TaiLieu } from "../../models/taiLieuModel.js";
import { Op, literal } from "sequelize";
import { sendGenericNotification } from "../../utils/notificationHelper.js";
import { SanPham_DichVu } from "../../models/sanPham_DichVuModel.js";
import cron from 'node-cron';
import { Sequelize } from "sequelize";
import { HoSo_VuViec } from "../../models/hoSoVuViecModel.js";
import { KhachHangCuoi } from "../../models/khanhHangCuoiModel.js";
import { DonDangKyNhanHieu_KH } from "../../models/KH/donDangKyNhanHieu_KHModel.js";
import { LichSuThamDinh_KH } from "../../models/KH/lichSuThamDinh_KHModel.js";
import { DonDK_SPDV_KH } from "../../models/KH/donDK_SPDVModel_KHModel.js";
import { TaiLieu_KH } from "../../models/KH/taiLieuKH_Model.js";
import { LichSuGiaHan_KH } from "../../models/KH/lichSuGiaHan_KH.js";
import { DonGiaHan_NH_VN } from "../../models/VN_GiaHan_NH/donGiaHanNH_VNModel.js";
import { DonGH_NH_VN_SPDV } from "../../models/VN_GiaHan_NH/donGH_NH_VN_SPDVModel.js";
import { TaiLieuGH_NH_VN } from "../../models/VN_GiaHan_NH/taiLieuGH_NH_VN_Model.js";
// const tinhHanXuLy = (app) => {
//     let duKienDate = null;

//     switch (app.trangThaiDon) {
//         case "Hoàn thành hồ sơ tài liệu":
//             duKienDate = app.ngayHoanThanhHoSoTaiLieu_DuKien;
//             break;
//         case "Thẩm định":
//             duKienDate = app.ngayKQThamDinh_DuKien;
//             break;
//     }

//     if (!duKienDate) return null;

//     const date = new Date(duKienDate);
//     if (isNaN(date.getTime())) return null;
//     return date.toISOString().split('T')[0];
// };

// export const tinhHanTraLoi = async (app, transaction = null) => {
//     if (
//         app.trangThaiDon === "Thẩm định"
//     ) {
//         const loaiThamDinh = app.trangThaiDon === "Thẩm định nội dung" ? "NoiDung" : "HinhThuc";

//         const lichSu = await LichSuThamDinh_KH.findOne({
//             where: {
//                 maDonDangKy: app.maDonDangKy,
//             },
//             order: [["lanThamDinh", "DESC"]],
//             transaction
//         });

//         if (!lichSu) return null;

//         const han =
//             lichSu.hanTraLoiGiaHan ||
//             lichSu.hanTraLoi;

//         if (!han) return null;

//         const hanDate = new Date(han);
//         return isNaN(hanDate.getTime()) ? null : hanDate.toISOString().split("T")[0];
//     }
//     return null;
// };


export const getAllApplication_GH_VN = async (req, res) => {
    try {
        const {
            maSPDVList,
            tenNhanHieu,
            trangThaiDon,
            searchText,
            fields = [],
            filterCondition = {},
            pageIndex = 1,
            pageSize = 20
        } = req.body;

        if (!fields.includes("maDonDangKy")) {
            fields.push("maDonDangKy");
        }

        const offset = (pageIndex - 1) * pageSize;
        const {
            selectedField,
            fromDate,
            toDate,
            hanXuLyFilter,
            hanTraLoiFilter,
            sortByHanXuLy,
            sortByHanTraLoi
        } = filterCondition;

        const whereCondition = {};

        //if (maNhanHieu) whereCondition.maNhanHieu = maNhanHieu;
        if (trangThaiDon) whereCondition.trangThaiDon = trangThaiDon;

        if (searchText) {
            const cleanText = searchText.replace(/-/g, '');
            whereCondition[Op.or] = [
                { soDon: { [Op.like]: `%${searchText}%` } },
                literal(`REPLACE(soDon, '-', '') LIKE '%${cleanText}%'`),
                { maHoSoVuViec: { [Op.like]: `%${searchText}%` } },
                literal(`REPLACE(maHoSoVuViec, '-', '') LIKE '%${cleanText}%'`)
            ];
        }

        if (selectedField && fromDate && toDate) {
            whereCondition[selectedField] = { [Op.between]: [fromDate, toDate] };
        }

        // Lọc hạn trả lời (hanTraLoiFilter)
        if (hanTraLoiFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let from = null, to = null;

            switch (hanTraLoiFilter) {
                case "<3":
                    from = today;
                    to = new Date(today);
                    to.setDate(today.getDate() + 3);
                    break;
                case "<7":
                    from = today;
                    to = new Date(today);
                    to.setDate(today.getDate() + 7);
                    break;
                case "overdue":
                    to = today;
                    break;
            }

            if (from && to) {
                whereCondition.hanTraLoi = { [Op.between]: [from, to] };
            } else if (to) {
                whereCondition.hanTraLoi = { [Op.lt]: to };
            }
        }

        // Lọc hạn xử lý (hanXuLyFilter)
        if (hanXuLyFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let from = null, to = null;

            switch (hanXuLyFilter) {
                case "<3":
                    from = today;
                    to = new Date(today);
                    to.setDate(today.getDate() + 3);
                    break;
                case "<7":
                    from = today;
                    to = new Date(today);
                    to.setDate(today.getDate() + 7);
                    break;
                case "overdue":
                    to = today;
                    break;
            }

            if (from && to) {
                whereCondition.hanXuLy = { [Op.between]: [from, to] };
            } else if (to) {
                whereCondition.hanXuLy = { [Op.lt]: to };
            }
        }

        if (fields.includes("trangThaiHoanThienHoSoTaiLieu")) {
            fields.push("taiLieuChuaNop", "ngayHoanThanhHoSoTaiLieu_DuKien");
        }
        if (!fields.includes("hanXuLy")) {
            fields.push("hanXuLy");
        }

        // ORDER theo sortBy...
        // const order = [];
        // if (sortByHanTraLoi) {
        //     order.push([Sequelize.literal('"hanTraLoi" IS NULL'), 'ASC']); // NULL xuống cuối
        //     order.push(['hanTraLoi', 'ASC']);
        // }
        // if (sortByHanXuLy) {
        //     order.push([Sequelize.literal('"hanXuLy" IS NULL'), 'ASC']);
        //     order.push(['hanXuLy', 'ASC']);
        // }

        const order = [];

        if (sortByHanTraLoi) {
            order.push([Sequelize.literal('hanTraLoi IS NULL'), 'ASC']); // NULL = TRUE (1), ASC đẩy xuống cuối
            order.push(['hanTraLoi', 'ASC']); // sắp xếp ngày tăng dần
        }

        if (sortByHanXuLy) {
            order.push([Sequelize.literal('hanXuLy IS NULL'), 'ASC']);
            order.push(['hanXuLy', 'ASC']);
        }


        const { count: totalItems, rows: applications } = await DonGiaHan_NH_VN.findAndCountAll({
            where: whereCondition,
            distinct: true,
            col: 'maDonGiaHan',
            include: [
                {
                    model: DonGH_NH_VN_SPDV,
                    as: 'DonGH_NH_VN_SPDV',
                    where: maSPDVList && maSPDVList.length > 0 ? {
                        maSPDV: { [Op.in]: maSPDVList }
                    } : undefined,
                    required: maSPDVList && maSPDVList.length > 0,
                    attributes: ['maSPDV']
                },
                {
                    model: NhanHieu,
                    as: 'NhanHieu',
                    attributes: ['tenNhanHieu'],
                    required: !!tenNhanHieu,
                    where: tenNhanHieu ? { tenNhanHieu: { [Op.like]: `%${tenNhanHieu}%` } } : undefined
                }
            ],
            limit: pageSize,
            offset: offset,
            order
        });

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "Không có đơn đăng ký nào" });
        }

        const fieldMap = {
            maDonGiaHan: app => app.maDonGiaHan,
            maHoSoVuViec: app => app.maHoSoVuViec,
            soDon: app => app.soDon,
            tenNhanHieu: app => app.NhanHieu?.tenNhanHieu || null,
            trangThaiDon: app => app.trangThaiDon,
            ngayNopDon: app => app.ngayNopDon,

            ngayNhanBang: app => app.ngayNhanBang,
            soBang: app => app.soBang,
            ngayCapBang: app => app.ngayCapBang,
            ngayHetHanBang: app => app.ngayHetHanBang,
            ngayGuiBangChoKhachHang: app => app.ngayGuiBangChoKhachHang,
            trangThaiHoanThienHoSoTaiLieu: app => {
                if (app.ngayHoanThanhHoSoTaiLieu) return "Hoàn thành";
                return app.trangThaiHoanThienHoSoTaiLieu || "Chưa hoàn thành";
            },

            dsSPDV: app => app.DonGH_NH_VN_SPDV?.map(sp => ({ maSPDV: sp.maSPDV })) || [],
            hanXuLy: app => app.hanXuLy,
            hanTraLoi: app => app.hanTraLoi,
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

        res.status(200).json({
            data: result,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize),
                pageIndex: Number(pageIndex),
                pageSize: Number(pageSize)
            }
        });
    } catch (error) {
        console.error("Lỗi getAllApplication:", error);
        res.status(500).json({ message: error.message });
    }
};



export const getApplicationById_GH_VN = async (req, res) => {
    try {
        const { maDonGiaHan } = req.body;
        if (!maDonGiaHan) return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });

        const don = await DonGiaHan_NH_VN.findOne({
            where: { maDonGiaHan },
            include: [
                {
                    model: TaiLieuGH_NH_VN,
                    as: "TaiLieuGH_NH_VN",
                    attributes: ["maTaiLieu", "tenTaiLieu", "linkTaiLieu", "trangThai"]
                },
                {
                    model: DonGH_NH_VN_SPDV,
                    as: "DonGH_NH_VN_SPDV",
                    attributes: ["maSPDV"]
                },
                {
                    model: NhanHieu,
                    as: "NhanHieu",
                    attributes: ["maNhanHieu", "tenNhanHieu", "linkAnh"]
                }
            ]
        });


        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        const plainDon = don.toJSON();
        console.log("Plain Don:", plainDon);
        // plainDon.lichSuThamDinh = [];

        // if (Array.isArray(plainDon.lichSuThamDinh)) {
        //     for (const item of plainDon.lichSuThamDinh) {
        //         plainDon.lichSuThamDinh.push(item);
        //         // if (item.loaiThamDinh === "HinhThuc") {
        //         //     plainDon.lichSuThamDinhHT.push(item);
        //         // }
        //         // else if (item.loaiThamDinh === "NoiDung") {
        //         //     plainDon.lichSuThamDinhND.push(item);
        //         // }
        //     }
        // }
        // delete plainDon.lichSuThamDinh;
        plainDon.maSPDVList = plainDon.DonGH_NH_VN_SPDV
            ? plainDon.DonGH_NH_VN_SPDV.map(sp => sp.maSPDV)
            : [];

        delete plainDon.DonGH_NH_VN_SPDV;


        res.json(plainDon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createApplication_GH_VN = async (req, res) => {
    const transaction = await DonGiaHan_NH_VN.sequelize.transaction();
    try {
        const { nhanHieu, idHoSoVuViec, taiLieus, maHoSoVuViec, maSPDVList, ...donData } = req.body;
        const maDonGiaHan = `${maHoSoVuViec}`;
        if (!donData.maNhanHieu) {
            if (!nhanHieu?.tenNhanHieu) {
                throw new Error("Vui lòng điền tên nhãn hiệu");
            }

            const createdNhanHieu = await NhanHieu.create({
                tenNhanHieu: nhanHieu.tenNhanHieu,
                linkAnh: nhanHieu.linkAnh || null
            }, { transaction });

            donData.maNhanHieu = createdNhanHieu.maNhanHieu;
        }

        if (donData.giayUyQuyenGoc === false && !donData.maUyQuyen) {
            return res.status(400).json({ message: "Vui lòng chọn gốc cảu giấy ủy quyền." });
        }

        if (donData.giayUyQuyenGoc === true) {
            donData.maUyQuyen = null;
        }

        const newDon = await DonGiaHan_NH_VN.create({
            ...donData,
            maDonGiaHan: maDonGiaHan,
            idHoSoVuViec: idHoSoVuViec,
            maHoSoVuViec: maHoSoVuViec,
        }, { transaction });
        if (Array.isArray(taiLieus)) {
            for (const tl of taiLieus) {
                await TaiLieuGH_NH_VN.create({
                    maDonGiaHan: newDon.maDonGiaHan,
                    tenTaiLieu: tl.tenTaiLieu,
                    trangThai: tl.trangThai,
                    linkTaiLieu: tl.linkTaiLieu || null,
                }, { transaction });

            }
        }
        if (Array.isArray(maSPDVList)) {
            for (const maSPDV of maSPDVList) {
                await DonGH_NH_VN_SPDV.create({
                    maDonGiaHan: newDon.maDonGiaHan,
                    maSPDV: maSPDV,
                }, { transaction });
            }
        }
        // const hanXuLy = await tinhHanXuLy(newDon);
        // const hanTraLoi = await tinhHanTraLoi(newDon, transaction);
        // await newDon.update({ hanXuLy, hanTraLoi }, { transaction });
        await transaction.commit();
        res.status(201).json({
            message: "Tạo đơn đăng ký và tài liệu thành công",
            don: newDon
        });

    } catch (error) {
        await transaction.rollback();

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "Đơn đã tồn tại" });
        }

        console.error("Sequelize error:", JSON.stringify(error, null, 2));
        res.status(400).json({ message: error.message, errors: error.errors });
    }
};

export const updateApplication_GH_VN = async (req, res) => {
    const t = await DonGiaHan_NH_VN.sequelize.transaction();
    try {
        const { maDonGiaHan, taiLieus, maSPDVList, maNhanHieu, maNhanSuCapNhap, nhanHieu, ...updateData } = req.body;

        if (!maDonGiaHan) {
            return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });
        }

        const don = await DonGiaHan_NH_VN.findOne({
            where: { maDonGiaHan }
        });

        if (!don) {
            return res.status(404).json({ message: "Không tìm thấy đơn đăng ký ....." });
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
        if (nhanHieu && maNhanHieu) {
            const nhanHieuInstance = await NhanHieu.findByPk(maNhanHieu, { transaction: t });
            if (nhanHieuInstance) {
                if (nhanHieu.tenNhanHieu !== undefined) nhanHieuInstance.tenNhanHieu = nhanHieu.tenNhanHieu;
                if (nhanHieu.linkAnh !== undefined) nhanHieuInstance.linkAnh = nhanHieu.linkAnh;
                await nhanHieuInstance.save({ transaction: t });
            }
        }
        // Kiểm tra logic giấy ủy quyền gốc và mã ủy quyền
        // if (updateData.giayUyQuyenGoc === false && !updateData.maUyQuyen) {
        //     return res.status(400).json({ message: "Vui lòng chọn giấy ủy quyền khi không phải là bản gốc." });
        // }

        // if (updateData.giayUyQuyenGoc === true) {
        //     updateData.maUyQuyen = null; // reset nếu là bản gốc
        // }

        await don.update({ ...updateData, maNhanHieu }, { transaction: t });
        // const hanXuLy = await tinhHanXuLy(don);
        // const hanTraLoi = await tinhHanTraLoi(don);

        // await don.update({ hanXuLy, hanTraLoi }, { transaction: t });
        if (Array.isArray(taiLieus)) {
            for (const taiLieu of taiLieus) {
                if (taiLieu.maTaiLieu) {
                    await TaiLieuGH_NH_VN.update({
                        tenTaiLieu: taiLieu.tenTaiLieu,
                        linkTaiLieu: taiLieu.linkTaiLieu,
                        trangThai: taiLieu.trangThai,
                    }, {
                        where: { maTaiLieu: taiLieu.maTaiLieu },
                        transaction: t
                    });
                } else {
                    await TaiLieuGH_NH_VN.create({
                        tenTaiLieu: taiLieu.tenTaiLieu,
                        linkTaiLieu: taiLieu.linkTaiLieu,
                        trangThai: taiLieu.trangThai,
                        maDonGiaHan: maDonGiaHan
                    }, { transaction: t });
                }
            }
        }
        if (Array.isArray(maSPDVList)) {
            await DonGH_NH_VN_SPDV.destroy({
                where: { maDonGiaHan },
                transaction: t
            });
            for (const maSPDV of maSPDVList) {
                await DonGH_NH_VN_SPDV.create({
                    maDonGiaHan,
                    maSPDV
                }, { transaction: t });
            }
        }
        if (changedFields.length > 0) {
            await sendGenericNotification({
                maNhanSuCapNhap,
                title: "Cập nhập đơn đăng ký",
                bodyTemplate: (tenNhanSu) =>
                    `${tenNhanSu} đã cập nhập đơn gia hạn nhãn hiệu Việt Nam'${don.soDon || don.maDonGiaHan}'`,
                data: {
                    maDonGiaHan,
                    changes: changedFields,
                },
            });

        }
        // const hanXuLy = await tinhHanXuLy(don);
        // const hanTraLoi = await tinhHanTraLoi(don, t);

        // await don.update({ hanXuLy, hanTraLoi }, { transaction: t });
        await t.commit();
        res.json({ message: "Cập nhật đơn thành công", data: don });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ message: error.message });
    }
};


export const deleteApplication_GH_VN = async (req, res) => {
    try {
        const { maDonGiaHan, maNhanSuCapNhap } = req.body;

        if (!maDonGiaHan) {
            return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });
        }

        const don = await DonGiaHan_NH_VN.findByPk(maDonGiaHan);
        if (!don) {
            return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
        }
        await TaiLieu_KH.destroy({ where: { maDonGiaHan: maDonGiaHan } });
        await don.destroy();
        await sendGenericNotification({
            maNhanSuCapNhap,
            title: "Xóa đơn đăng ký",
            bodyTemplate: (tenNhanSu) =>
                `${tenNhanSu} đã xóa đơn đăng ký '${don.soDon}'`,
            data: {
                maDonGiaHan,
            },
        });
        res.status(200).json({ message: "Đã xoá đơn đăng ký và tài liệu liên quan" });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Đơn đăng ký đang được sử dụng, không thể xóa." });
        }

        res.status(500).json({ message: error.message });
    }
};


export const getFullApplicationDetail_GH_VN = async (req, res) => {
    try {
        const { maDonGiaHan } = req.body;
        if (!maDonGiaHan) return res.status(400).json({ message: "Thiếu mã đơn gia hạn" });

        const don = await DonGiaHan_NH_VN.findOne({
            where: { maDonGiaHan },
            include: [
                {
                    model: TaiLieuGH_NH_VN,
                    as: "TaiLieuGH_NH_VN",
                    attributes: ["maTaiLieu", "tenTaiLieu", "linkTaiLieu", "trangThai"]
                },
                {
                    model: DonGH_NH_VN_SPDV,
                    as: "DonGH_NH_VN_SPDV",
                    attributes: ["maSPDV"]
                },
                {
                    model: NhanHieu,
                    as: "NhanHieu",
                    attributes: ["maNhanHieu", "tenNhanHieu", "linkAnh"]
                },
                {
                    model: HoSo_VuViec,
                    as: "hoSoVuViec",
                    attributes: ["maHoSoVuViec", "noiDungVuViec", "maKhachHang"],
                    include: [
                        {
                            model: KhachHangCuoi,
                            as: "khachHang",
                            attributes: ["maKhachHang", "tenKhachHang", "diaChi", "sdt"]
                        }
                    ]
                }
            ]
        });

        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        const plainDon = don.toJSON();
        // plainDon.lichSuThamDinhHT = [];
        // plainDon.lichSuThamDinhND = [];

        // if (Array.isArray(plainDon.lichSuThamDinh)) {
        //     for (const item of plainDon.lichSuThamDinh) {
        //         if (item.loaiThamDinh === "HinhThuc") {
        //             plainDon.lichSuThamDinhHT.push(item);
        //         } else if (item.loaiThamDinh === "NoiDung") {
        //             plainDon.lichSuThamDinhND.push(item);
        //         }
        //     }
        // }

        // delete plainDon.lichSuThamDinh;
        plainDon.maSPDVList = plainDon.DonGH_NH_VN_SPDV.map(sp => sp.maSPDV);
        delete plainDon.DonGH_NH_VN_SPDV;

        if (plainDon.hoSoVuViec) {
            plainDon.maHoSoVuViec = plainDon.hoSoVuViec.maHoSoVuViec;
            plainDon.tenHoSoVuViec = plainDon.hoSoVuViec.tenHoSoVuViec;

            if (plainDon.hoSoVuViec.khachHang) {
                plainDon.maKhachHang = plainDon.hoSoVuViec.khachHang.maKhachHang;
                plainDon.tenKhachHang = plainDon.hoSoVuViec.khachHang.tenKhachHang;
            }
        }

        res.json(plainDon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const getApplicationsByMaKhachHang_KH = async (req, res) => {
//     try {
//         const { maKhachHang } = req.body;

//         if (!maKhachHang) {
//             return res.status(400).json({ message: "Thiếu mã khách hàng" });
//         }

//         const applications = await DonDangKyNhanHieu_KH.findAll({
//             attributes: ['maDonDangKy', 'soDon'],
//             where: {
//                 giayUyQuyenGoc: true
//             },
//             include: [
//                 {
//                     model: HoSo_VuViec,
//                     as: 'hoSoVuViec',
//                     required: true,
//                     attributes: [],
//                     on: {
//                         '$hoSoVuViec.maHoSoVuViec$': { [Op.eq]: Sequelize.col('DonDangKyNhanHieu_KH.maHoSoVuViec') },
//                         '$hoSoVuViec.maKhachHang$': maKhachHang
//                     }
//                 }
//             ]

//         });
//         if (!applications || applications.length === 0) {
//             // return res.status(404).json({ message: "Không tìm thấy đơn nào" });
//         }

//         res.status(200).json(applications);
//     } catch (error) {
//         console.error("Lỗi getApplicationsByMaKhachHang:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getMaKhachHangByMaHoSoVuViec_KH = async (req, res) => {
//     try {
//         const { maHoSoVuViec } = req.body;

//         if (!maHoSoVuViec) {
//             return res.status(400).json({ message: "Thiếu mã hồ sơ vụ việc" });
//         }

//         const hoSo = await HoSo_VuViec.findOne({
//             where: { maHoSoVuViec },
//             attributes: ['maKhachHang'],
//         });

//         if (!hoSo) {
//             return res.status(404).json({ message: "Không tìm thấy hồ sơ vụ việc" });
//         }

//         res.status(200).json({ maKhachHang: hoSo.maKhachHang });
//     } catch (error) {
//         console.error("Lỗi getMaKhachHangByMaHoSoVuViec:", error);
//         res.status(500).json({ message: error.message });
//     }
// };
