import { DonDangKy } from "../models/donDangKyModel.js";
import { DonDK_SPDV } from "../models/donDK_SPDVMolel.js";
import { LichSuThamDinh } from "../models/lichSuThamDinhModel.js";
import { LoaiDon } from "../models/loaiDonModel.js";
import { NhanHieu } from "../models/nhanHieuModel.js";
import { TaiLieu } from "../models/taiLieuModel.js";
import { Op } from "sequelize";

export const getAllApplication = async (req, res) => {
    try {
        const { maSPDVList, maNhanHieu, searchText } = req.body;
        const whereCondition = {};
        if (maNhanHieu) whereCondition.maNhanHieu = maNhanHieu;

        if (searchText) {
            whereCondition[Op.and] = literal(`REPLACE(soDon, '-', '') LIKE '%${searchText}%'`);
        }
        const applications = await DonDangKy.findAll({
            where: whereCondition,
            include: [
                {
                    model: DonDK_SPDV, as: "dsSPDV",
                    where: maSPDVList && maSPDVList.length > 0 ? {
                        maSPDV: { [Op.in]: maSPDVList }
                    } : undefined,
                    required: maSPDVList && maSPDVList.length > 0 // bắt buộc join nếu lọc
                }
            ]
        });
        res.status(200).json(applications);
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
                    attributes: ["maNhanHieu"]
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

        if(Array.isArray(plainDon.lichSuThamDinh)) {
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
                    ngayBiTuChoiTD: item.ngayBiTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ghiChu: item.ghiChu || null,
                }, { transaction });
            }
        }
        if (Array.isArray(lichSuThamDinhND)) {
            for (const item of lichSuThamDinhND) {
                await LichSuThamDinh.create({
                    maDonDangKy,
                    loaiThamDinh: item.loaiThamDinh,
                    lanThamDinh: item.lanThamDinh,
                    ngayBiTuChoiTD: item.ngayBiTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ghiChu: item.ghiChu || null,
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
        const { maDonDangKy, taiLieus, maSPDVList, lichSuThamDinhHT, lichSuThamDinhND, maNhanHieu, ...updateData } = req.body;

        if (!maDonDangKy) {
            return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });
        }

        const don = await DonDangKy.findByPk(maDonDangKy);
        if (!don) {
            return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
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
                    ngayBiTuChoiTD: item.ngayBiTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ghiChu: item.ghiChu || null,
                }, { transaction: t });
            }
        }
        
        if (Array.isArray(lichSuThamDinhND)) {
            for (const item of lichSuThamDinhND) {
                await LichSuThamDinh.create({
                    maDonDangKy,
                    loaiThamDinh: item.loaiThamDinh,
                    lanThamDinh: item.lanThamDinh,
                    ngayBiTuChoiTD: item.ngayBiTuChoiTD,
                    ketQuaThamDinh: "KhongDat",
                    hanTraLoi: item.hanTraLoi || null,
                    giaHan: item.giaHan || false,
                    ghiChu: item.ghiChu || null,
                }, { transaction: t });
            }
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
        const { maDonDangKy } = req.body;

        if (!maDonDangKy) {
            return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });
        }

        const don = await DonDangKy.findByPk(maDonDangKy);
        if (!don) {
            return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
        }
        await TaiLieu.destroy({ where: { maDon: maDonDangKy } });
        await don.destroy();

        res.status(200).json({ message: "Đã xoá đơn đăng ký và tài liệu liên quan" });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "Đơn đăng ký đang được sử dụng, không thể xóa." });
        }

        res.status(500).json({ message: error.message });
    }
};


