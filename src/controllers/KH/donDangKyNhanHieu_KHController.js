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
import crypto from "crypto";
import { VuViec } from "../../models/vuViecModel.js";
import { DoiTac } from "../../models/doiTacModel.js";
const tinhHanXuLy = (app) => {
    let duKienDate = null;

    switch (app.trangThaiDon) {
        case "Hoàn thành hồ sơ tài liệu":
            duKienDate = app.ngayHoanThanhHoSoTaiLieu_DuKien;
            break;
        case "Thẩm định":
            duKienDate = app.ngayKQThamDinh_DuKien;
            break;
    }

    if (!duKienDate) return null;

    const date = new Date(duKienDate);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
};

export const tinhHanTraLoi = async (app, transaction = null) => {
    if (
        app.trangThaiDon === "Thẩm định"
    ) {
        const loaiThamDinh = app.trangThaiDon === "Thẩm định nội dung" ? "NoiDung" : "HinhThuc";

        const lichSu = await LichSuThamDinh_KH.findOne({
            where: {
                maDonDangKy: app.maDonDangKy,
            },
            order: [["lanThamDinh", "DESC"]],
            transaction
        });

        if (!lichSu) return null;

        const han =
            lichSu.hanTraLoiGiaHan ||
            lichSu.hanTraLoi;

        if (!han) return null;

        const hanDate = new Date(han);
        return isNaN(hanDate.getTime()) ? null : hanDate.toISOString().split("T")[0];
    }
    return null;
};


export const getAllApplication_KH = async (req, res) => {
    try {
        const {
            maSPDVList,
            tenNhanHieu,
            maNhanHieu,
            trangThaiDon,
            searchText,
            fields = [],
            filterCondition = {},
            idKhachHang,
            idDoiTac,
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

        if (maNhanHieu) whereCondition.maNhanHieu = maNhanHieu;
        if (trangThaiDon) whereCondition.trangThaiDon = trangThaiDon;
        if (idDoiTac) whereCondition.idDoiTac = idDoiTac;
        if (idKhachHang) whereCondition.idKhachHang = idKhachHang;

        if (searchText) {
            const cleanText = searchText.replace(/-/g, '');
            whereCondition[Op.or] = [
                { soDon: { [Op.like]: `%${searchText}%` } },
                literal(`REPLACE(soDon, '-', '') LIKE '%${cleanText}%'`),
                { maHoSo: { [Op.like]: `%${searchText}%` } },
                literal(`REPLACE(maHoSo, '-', '') LIKE '%${cleanText}%'`)
            ];
        }

        if (selectedField && fromDate && toDate) {
            whereCondition[selectedField] = { [Op.between]: [fromDate, toDate] };
        }

        // Lọc hạn trả lời
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

        // Lọc hạn xử lý
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

        // ORDER
        const order = [];
        if (sortByHanTraLoi) {
            order.push([Sequelize.literal('hanTraLoi IS NULL'), 'ASC']);
            order.push(['hanTraLoi', 'ASC']);
        }
        if (sortByHanXuLy) {
            order.push([Sequelize.literal('hanXuLy IS NULL'), 'ASC']);
            order.push(['hanXuLy', 'ASC']);
        }

        // ===============================
        // 1. Count (không JOIN)
        // ===============================
        const totalItems = await DonDangKyNhanHieu_KH.count({
            where: whereCondition
        });

        // ===============================
        // 2. Data (có JOIN đầy đủ)
        // ===============================
        const applications = await DonDangKyNhanHieu_KH.findAll({
            where: whereCondition,
            include: [
                {
                    model: DonDK_SPDV_KH,
                    as: 'DonDK_SPDV_KH',
                    where: maSPDVList && maSPDVList.length > 0 ? {
                        maSPDV: { [Op.in]: maSPDVList }
                    } : undefined,
                    required: maSPDVList && maSPDVList.length > 0,
                    attributes: ['maSPDV']
                },
                {
                    model: TaiLieu_KH,
                    where: { trangThai: 'Chưa nộp' },
                    required: false,
                    as: 'taiLieuChuaNop_KH',
                    attributes: ['tenTaiLieu']
                },
                {
                    model: NhanHieu,
                    as: 'nhanHieu',
                    attributes: ['tenNhanHieu'],
                    required: !!tenNhanHieu,
                    where: tenNhanHieu ? { tenNhanHieu: { [Op.like]: `%${tenNhanHieu}%` } } : undefined
                },
                { model: KhachHangCuoi, as: "khachHang", attributes: ["tenKhachHang"], required: false },
                { model: DoiTac, as: "doitac", attributes: ["tenDoiTac"], required: false }
            ],
            limit: pageSize,
            offset: offset,
            order
        });

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "Không có đơn đăng ký nào" });
        }

        // Mapping field
        const fieldMap = {
            maDonDangKy: app => app.maDonDangKy,
            maHoSoVuViec: app => app.maHoSoVuViec,
            soDon: app => app.soDon,
            tenNhanHieu: app => app.nhanHieu?.tenNhanHieu || null,
            tenKhachHang: app => app.khachHang?.tenKhachHang || null,
            tenDoiTac: app => app.doitac?.tenDoiTac || null,
            trangThaiDon: app => app.trangThaiDon,
            ngayNopDon: app => app.ngayNopDon,
            ngayHoanThanhHoSoTaiLieu: app => app.ngayHoanThanhHoSoTaiLieu,
            ngayKQThamDinhHinhThuc: app => app.ngayKQThamDinhHinhThuc,
            ngayCongBoDon: app => app.ngayCongBoDon,
            ngayKQThamDinhND: app => app.ngayKQThamDinhND,
            ngayTraLoiKQThamDinhND: app => app.ngayTraLoiKQThamDinhND,
            ngayThongBaoCapBang: app => app.ngayThongBaoCapBang,
            hanNopPhiCapBang: app => app.hanNopPhiCapBang,
            ngayNopPhiCapBang: app => app.ngayNopPhiCapBang,
            ngayNhanBang: app => app.ngayNhanBang,
            soBang: app => app.soBang,
            ngayCapBang: app => app.ngayCapBang,
            ngayHetHanBang: app => app.ngayHetHanBang,
            ngayGuiBangChoKhachHang: app => app.ngayGuiBangChoKhachHang,
            trangThaiHoanThienHoSoTaiLieu: app => {
                if (app.ngayHoanThanhHoSoTaiLieu) return "Hoàn thành";
                return app.trangThaiHoanThienHoSoTaiLieu || "Chưa hoàn thành";
            },
            ngayHoanThanhHoSoTaiLieu_DuKien: app => app.ngayHoanThanhHoSoTaiLieu_DuKien,
            taiLieuChuaNop: app => app.taiLieuChuaNop_KH?.map(tl => ({ tenTaiLieu: tl.tenTaiLieu })) || [],
            dsSPDV: app => app.DonDK_SPDV_KH?.map(sp => ({ maSPDV: sp.maSPDV })) || [],
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


export const getApplicationById_KH = async (req, res) => {
    try {
        const { maDonDangKy } = req.body;
        if (!maDonDangKy) return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });

        const don = await DonDangKyNhanHieu_KH.findOne({
            where: { maDonDangKy },
            include: [
                {
                    model: TaiLieu_KH,
                    as: "taiLieuChuaNop_KH",
                    attributes: ["maTaiLieu", "tenTaiLieu", "linkTaiLieu", "trangThai"]
                },
                {
                    model: DonDK_SPDV_KH,
                    as: "DonDK_SPDV_KH",
                    attributes: ["maSPDV"]
                },
                {
                    model: NhanHieu,
                    as: "nhanHieu",
                    attributes: ["maNhanHieu", "tenNhanHieu", "linkAnh"]
                },
                {
                    model: LichSuThamDinh_KH,
                    as: "lichSuThamDinh",
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [
                        {
                            model: LichSuGiaHan_KH,
                            as: "giaHanList", // tên alias phải khớp với định nghĩa quan hệ
                            attributes: { exclude: ['createdAt', 'updatedAt'] }
                        }
                    ]
                }
            ]
        });


        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        const plainDon = don.toJSON();

        // lấy thông tin VuViec bằng maHoSo
        const vuViecs = await VuViec.findAll({
            where: { maHoSo: plainDon.maHoSo },
            attributes: [
                "id",
                "maHoSo",
                "tenVuViec",
                "soDon",
                "idKhachHang",
                "ngayTaoVV",
                "deadline",
                "softDeadline",
                "soTien",
                "xuatBill",
                "isMainCase",
                "maNguoiXuLy"
            ],
            order: [["createdAt", "DESC"]] // hoặc ASC nếu muốn tăng dần
        });


        // gắn vào kết quả trả về (dạng mảng)
        plainDon.vuViec = vuViecs.map(v => v.toJSON());
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
        plainDon.maSPDVList = plainDon.DonDK_SPDV_KH.map(sp => sp.maSPDV);
        delete plainDon.DonDK_SPDV_KH;

        res.json(plainDon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const generateMaDonDangKy = (maHoSo) => {
    // Tạo chuỗi random 6 ký tự (có thể chỉnh độ dài)
    const randomStr = crypto.randomBytes(3).toString("hex");
    return `${maHoSo}_${randomStr}`;
};
export const createApplication_KH = async (req, res) => {
    const transaction = await DonDangKyNhanHieu_KH.sequelize.transaction();
    try {
        const { nhanHieu, taiLieus, vuViecs, maHoSo, maHoSoVuViec, lichSuThamDinh, maSPDVList, maNguoiXuLy1, maNguoiXuLy2, ...donData } = req.body;
        const maDonDangKy = generateMaDonDangKy(maHoSo);
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
        const newDon = await DonDangKyNhanHieu_KH.create({
            ...donData,
            maDonDangKy: maDonDangKy,
            maHoSoVuViec: maHoSo,
            maHoSo: maHoSo,
            maNguoiXuLy1: maNguoiXuLy1,
            maNguoiXuLy2: maNguoiXuLy2,
        }, { transaction });

        if (Array.isArray(taiLieus)) {
            for (const tl of taiLieus) {
                await TaiLieu_KH.create({
                    maDonDangKy: newDon.maDonDangKy,
                    tenTaiLieu: tl.tenTaiLieu,
                    trangThai: tl.trangThai,
                    linkTaiLieu: tl.linkTaiLieu || null,
                }, { transaction });
            }
        }
        for (const vuViec of vuViecs) {
            let ngayXuatBill = null;
            let maNguoiXuatBill = null;
            if (vuViec.xuatBill === true) {
                ngayXuatBill = new Date();
                maNguoiXuatBill = maNhanSuCapNhap
            }
            await VuViec.create(
                {
                    tenVuViec: vuViec.tenVuViec,
                    moTa: vuViec.moTa,
                    trangThai: vuViec.trangThai,
                    maHoSo: maHoSo,
                    maDon: maDonDangKy,
                    soDon: donData.soDon,
                    idKhachHang: donData.idKhachHang,
                    idDoiTac: donData.idDoiTac,
                    maQuocGiaVuViec: "KH",
                    ngayTaoVV: new Date(),
                    maNguoiXuLy: vuViec.maNguoiXuLy,
                    clientsRef: donData.clientsRef,
                    tenBang: "DonDangKyNhanHieu",
                    deadline: vuViec.deadline,
                    softDeadline: vuViec.softDeadline,
                    xuatBill: vuViec.xuatBill,
                    ngayXuatBill: ngayXuatBill,
                    maNguoiXuatBill: maNguoiXuatBill,
                    soTien: vuViec.soTien,
                    isMainCase: vuViec.isMainCase,
                },
                { transaction }
            );

        }
        if (Array.isArray(maSPDVList)) {
            for (const maSPDV of maSPDVList) {
                await DonDK_SPDV_KH.create({
                    maDonDangKy: newDon.maDonDangKy,
                    maSPDV: maSPDV,
                }, { transaction });
            }
        }
        if (Array.isArray(lichSuThamDinh)) {
            for (const item of lichSuThamDinh) {
                const createdThamDinh = await LichSuThamDinh_KH.create({
                    maDonDangKy,
                    lanThamDinh: item.lanThamDinh,
                    ngayNhanThongBaoTuChoiTD: item.ngayNhanThongBaoTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ngayGiaHan: item.ngayGiaHan || null,
                    hanTraLoiGiaHan: item.hanTraLoiGiaHan || null,
                    ngayTraLoiThongBaoTuChoi: item.ngayTraLoiThongBaoTuChoi || null,
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
                    ngayNopYeuCauSauKN: item.ngayNopYeuCauSauKN
                }, { transaction });

                // Nếu có nhiều lần gia hạn trong lần thẩm định này
                if (Array.isArray(item.giaHanList)) {
                    for (const gh of item.giaHanList) {
                        await LichSuGiaHan_KH.create({
                            idLichSuThamDinh: createdThamDinh.id,
                            maDonDangKy,
                            lanGiaHan: gh.lanGiaHan,
                            ngayYeuCauGiaHan: gh.ngayYeuCauGiaHan,
                            ngayCapGiaHan: gh.ngayCapGiaHan,
                            hanTraLoi: gh.hanTraLoi || null,
                            ghiChu: gh.ghiChu || null
                        }, { transaction });
                    }
                }
            }
        }

        const hanXuLy = await tinhHanXuLy(newDon);
        const hanTraLoi = await tinhHanTraLoi(newDon, transaction);

        await newDon.update({ hanXuLy, hanTraLoi }, { transaction });
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

export const updateApplication_KH = async (req, res) => {
    const t = await DonDangKyNhanHieu_KH.sequelize.transaction();
    try {
        const { maDonDangKy, maHoSo, taiLieus, vuViecs, maSPDVList, lichSuThamDinh, maNhanHieu, maNhanSuCapNhap, nhanHieu, maNguoiXuLy1, maNguoiXuLy2, ...updateData } = req.body;

        if (!maDonDangKy) {
            return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });
        }

        const don = await DonDangKyNhanHieu_KH.findOne({
            where: { maDonDangKy }
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
        console.log("Mã người xử lý 1:", maNguoiXuLy1)
        await don.update({ ...updateData, maNhanHieu, maNguoiXuLy1, maNguoiXuLy2 }, { transaction: t });
        // const hanXuLy = await tinhHanXuLy(don);
        // const hanTraLoi = await tinhHanTraLoi(don);

        // await don.update({ hanXuLy, hanTraLoi }, { transaction: t });
        const taiLieusHienTai = await TaiLieu_KH.findAll({
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
                    await TaiLieu_KH.update({
                        tenTaiLieu: taiLieu.tenTaiLieu,
                        linkTaiLieu: taiLieu.linkTaiLieu,
                        trangThai: taiLieu.trangThai,
                    }, {
                        where: { maTaiLieu: taiLieu.maTaiLieu },
                        transaction: t
                    });
                } else {
                    await TaiLieu_KH.create({
                        tenTaiLieu: taiLieu.tenTaiLieu,
                        linkTaiLieu: taiLieu.linkTaiLieu,
                        trangThai: taiLieu.trangThai,
                        maDonDangKy: maDonDangKy
                    }, { transaction: t });
                }
            }
        }

        // ==================== Đồng bộ Vụ Việc ====================
        if (Array.isArray(vuViecs)) {
            const vuViecsHienTai = await VuViec.findAll({
                where: { maHoSo },
                transaction: t
            });

            const idVuViecsTruyenLen = vuViecs
                .filter(vv => vv.id) // hoặc vv.maVuViec tuỳ bạn chuẩn hoá
                .map(vv => vv.id);

            // Xoá vụ việc không còn trong request
            for (const vuViecCu of vuViecsHienTai) {
                if (!idVuViecsTruyenLen.includes(vuViecCu.id)) {
                    await vuViecCu.destroy({ transaction: t });
                }
            }

            // Thêm mới hoặc cập nhật vụ việc
            for (const vuViec of vuViecs) {
                let ngayXuatBill = null;
                let maNguoiXuatBill = null;
                if (vuViec.xuatBill === true) {
                    ngayXuatBill = new Date();
                    maNguoiXuatBill = maNhanSuCapNhap
                }
                if (vuViec.id) {
                    // ✅ chỉ update các field có thể thay đổi
                    await VuViec.update(
                        {
                            tenVuViec: vuViec.tenVuViec,
                            moTa: vuViec.moTa,
                            trangThai: vuViec.trangThai,
                            maHoSo: maHoSo,
                            maDon: maDonDangKy,
                            soDon: don.soDon,
                            idKhachHang: don.idKhachHang,
                            idDoiTac: updateData.idDoiTac,
                            maQuocGiaVuViec: "KH",
                            ngayTaoVV: new Date(),
                            maNguoiXuLy: vuViec.maNguoiXuLy,
                            clientsRef: don.clientsRef,
                            tenBang: "DonDangKyNhanHieu",
                            deadline: vuViec.deadline,
                            softDeadline: vuViec.softDeadline,
                            xuatBill: vuViec.xuatBill,
                            ngayXuatBill: ngayXuatBill,
                            maNguoiXuatBill: maNguoiXuatBill,
                            soTien: vuViec.soTien,
                            isMainCase: vuViec.isMainCase,
                        },
                        {
                            where: { id: vuViec.id },
                            transaction: t
                        }
                    );
                } else {
                    // ✅ create thì set đầy đủ
                    await VuViec.create(
                        {
                            tenVuViec: vuViec.tenVuViec,
                            moTa: vuViec.moTa,
                            trangThai: vuViec.trangThai,
                            maHoSo: maHoSo,
                            maDon: maDonDangKy,
                            soDon: don.soDon,
                            idKhachHang: don.idKhachHang,
                            idDoiTac: updateData.idDoiTac,
                            maQuocGiaVuViec: "KH",
                            ngayTaoVV: new Date(),
                            maNguoiXuLy: vuViec.maNguoiXuLy,
                            clientsRef: don.clientsRef,
                            tenBang: "DonDangKyNhanHieu",
                            deadline: vuViec.deadline,
                            softDeadline: vuViec.softDeadline,
                            xuatBill: vuViec.xuatBill,
                            ngayXuatBill: ngayXuatBill,
                            maNguoiXuatBill: maNguoiXuatBill,
                            soTien: vuViec.soTien,
                            isMainCase: vuViec.isMainCase,
                        },
                        { transaction: t }
                    );
                }
            }
        }

        if (Array.isArray(maSPDVList)) {
            await DonDK_SPDV_KH.destroy({
                where: { maDonDangKy },
                transaction: t
            });
            for (const maSPDV of maSPDVList) {
                await DonDK_SPDV_KH.create({
                    maDonDangKy,
                    maSPDV
                }, { transaction: t });
            }
        }
        if (Array.isArray(lichSuThamDinh)) {
            let coGiaHan = false;
            for (const item of lichSuThamDinh) {
                if (Array.isArray(item.giaHanList) && item.giaHanList.length > 0) {
                    coGiaHan = true;
                    break;
                }
            }

            if (coGiaHan) {
                await LichSuGiaHan_KH.destroy({
                    where: { maDonDangKy },
                    transaction: t
                });
            }

            await LichSuThamDinh_KH.destroy({
                where: { maDonDangKy },
                transaction: t
            });
        }


        if (Array.isArray(lichSuThamDinh)) {
            for (const item of lichSuThamDinh) {
                const createdThamDinh = await LichSuThamDinh_KH.create({
                    maDonDangKy,
                    lanThamDinh: item.lanThamDinh,
                    ngayNhanThongBaoTuChoiTD: item.ngayNhanThongBaoTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ngayGiaHan: item.ngayGiaHan || null,
                    hanTraLoiGiaHan: item.hanTraLoiGiaHan || null,
                    ngayTraLoiThongBaoTuChoi: item.ngayTraLoiThongBaoTuChoi || null,
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

                    ngayNopYeuCauSauKN: item.ngayNopYeuCauSauKN
                }, { transaction: t });

                if (Array.isArray(item.giaHanList)) {
                    for (const gh of item.giaHanList) {
                        await LichSuGiaHan_KH.create({
                            idLichSuThamDinh: createdThamDinh.id,
                            maDonDangKy,
                            lanGiaHan: gh.lanGiaHan,
                            ngayYeuCauGiaHan: gh.ngayYeuCauGiaHan,
                            ngayCapGiaHan: gh.ngayCapGiaHan,
                            hanTraLoiGiaHan: gh.hanTraLoiGiaHan || null,
                            // ghiChu: gh.ghiChu || null
                        }, { transaction: t });
                    }
                }

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
        const hanXuLy = await tinhHanXuLy(don);
        const hanTraLoi = await tinhHanTraLoi(don, t);

        await don.update({ hanXuLy, hanTraLoi }, { transaction: t });
        await t.commit();
        res.json({ message: "Cập nhật đơn thành công", data: don });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ message: error.message });
    }
};


export const deleteApplication_KH = async (req, res) => {
    try {
        const { maDonDangKy, maNhanSuCapNhap } = req.body;

        if (!maDonDangKy) {
            return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });
        }

        const don = await DonDangKyNhanHieu_KH.findByPk(maDonDangKy);
        if (!don) {
            return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
        }
        await TaiLieu_KH.destroy({ where: { maDonDangKy: maDonDangKy } });
        await don.destroy();
        await sendGenericNotification({
            maNhanSuCapNhap,
            title: "Xóa đơn đăng ký",
            bodyTemplate: (tenNhanSu) =>
                `${tenNhanSu} đã xóa đơn đăng ký '${don.soDon}'`,
            data: {
                maDonDangKy,
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


export const getFullApplicationDetail_KH = async (req, res) => {
    try {
        const { maDonDangKy } = req.body;
        if (!maDonDangKy) return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });

        const don = await DonDangKyNhanHieu_KH.findOne({
            where: { maDonDangKy },
            include: [
                {
                    model: TaiLieu_KH,
                    as: "taiLieuChuaNop_KH",
                    attributes: ["maTaiLieu", "tenTaiLieu", "linkTaiLieu", "trangThai"]
                },
                {
                    model: DonDK_SPDV_KH,
                    as: "DonDK_SPDV_KH",
                    attributes: ["maSPDV"]
                },
                {
                    model: NhanHieu,
                    as: "nhanHieu",
                    attributes: ["maNhanHieu", "tenNhanHieu", "linkAnh"]
                },
                {
                    model: LichSuThamDinh_KH,
                    as: "lichSuThamDinh",
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: KhachHangCuoi,
                    as: "khachHang",
                    attributes: ["id", "maKhachHang", "tenKhachHang", "diaChi", "sdt"]
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
        plainDon.maSPDVList = plainDon.DonDK_SPDV_KH.map(sp => sp.maSPDV);
        delete plainDon.DonDK_SPDV_KH;

        // Lấy thông tin khách hàng từ plainDon.khachHang nếu có
        console.log("Khách hàng", plainDon.khachHang)
        if (plainDon.khachHang) {
            plainDon.maKhachHang = plainDon.khachHang.maKhachHang;
            plainDon.tenKhachHang = plainDon.khachHang.tenKhachHang;
            plainDon.diaChi = plainDon.khachHang.diaChi;
            plainDon.sdt = plainDon.khachHang.sdt;
        }

        res.json(plainDon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getApplicationsByMaKhachHang_KH = async (req, res) => {
    try {
        const { maKhachHang } = req.body;

        if (!maKhachHang) {
            return res.status(400).json({ message: "Thiếu mã khách hàng" });
        }

        const applications = await DonDangKyNhanHieu_KH.findAll({
            attributes: ['maDonDangKy', 'soDon'],
            where: {
                giayUyQuyenGoc: true
            },
            include: [
                {
                    model: HoSo_VuViec,
                    as: 'hoSoVuViec',
                    required: true,
                    attributes: [],
                    on: {
                        '$hoSoVuViec.maHoSoVuViec$': { [Op.eq]: Sequelize.col('DonDangKyNhanHieu_KH.maHoSoVuViec') },
                        '$hoSoVuViec.maKhachHang$': maKhachHang
                    }
                }
            ]

        });
        if (!applications || applications.length === 0) {
            // return res.status(404).json({ message: "Không tìm thấy đơn nào" });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error("Lỗi getApplicationsByMaKhachHang:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getMaKhachHangByMaHoSoVuViec_KH = async (req, res) => {
    try {
        const { maHoSoVuViec } = req.body;

        if (!maHoSoVuViec) {
            return res.status(400).json({ message: "Thiếu mã hồ sơ vụ việc" });
        }

        const hoSo = await HoSo_VuViec.findOne({
            where: { maHoSoVuViec },
            attributes: ['maKhachHang'],
        });

        if (!hoSo) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ vụ việc" });
        }

        res.status(200).json({ maKhachHang: hoSo.maKhachHang });
    } catch (error) {
        console.error("Lỗi getMaKhachHangByMaHoSoVuViec:", error);
        res.status(500).json({ message: error.message });
    }
};
