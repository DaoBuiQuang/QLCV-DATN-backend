import { DonDangKy } from "../models/donDangKyModel.js";
import { DonDK_SPDV } from "../models/donDK_SPDVMolel.js";
import { LoaiDon } from "../models/loaiDonModel.js";
import { NhanHieu } from "../models/nhanHieuModel.js";
import { TaiLieu } from "../models/taiLieuModel.js";

export const getAllApplication = async (req, res) => {
    try {
        const {searchText, maLoaiDon} = req.body
        const whereCondition = {};
        if (maLoaiDon) whereCondition.maLoaiDon = maLoaiDon;
        const applications = await DonDangKy.findAll({
            where: whereCondition,
            // attributes:[
            //     "maLoaiDon"
            // ],
            include: [
                {model: LoaiDon, as: "loaiDon", attributes:["tenLoaiDon"]}
            ]
        })
        const formatApplications = applications.map(ddk => {
            const data = ddk.toJSON();
            delete data.loaiDon;
            return {
                ...data, 
                tenLoaiDon: ddk.loaiDon?.tenLoaiDon || null 
            };
        });
        res.status(200).json(formatApplications);
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
                    as: "taiLieus",
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
                }
            ]
        });
        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
        res.json(don);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const createApplication = async (req, res) => {
    const transaction = await DonDangKy.sequelize.transaction();
    try {
        const { taiLieus, maHoSoVuViec, maSPDVList, ...donData } = req.body;
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
        const { maDonDangKy, taiLieus, maSPDVList, maNhanHieu, ...updateData } = req.body;

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

        // --- CẬP NHẬT SPDV ---
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
        if (!maDonDangKy) return res.status(400).json({ message: "Thiếu max đơn đăng ký" });

        const don = await DonDangKy.findByPk(maDonDangKy);
        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });
        await TaiLieu.destroy({ where: { maDon: maDonDangKy } });
        await don.destroy();

        res.json({ message: "Đã xoá đơn đăng ký và tài liệu liên quan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

