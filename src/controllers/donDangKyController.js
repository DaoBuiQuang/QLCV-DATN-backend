import { DonDangKy } from "../models/donDangKyModel.js";
import { LoaiDon } from "../models/loaiDonModel.js";
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
                }
            ]
        });

        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        res.json(don);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createApplication = async (req, res) => {
    const transaction = await DonDangKy.sequelize.transaction();
    try {
        const { taiLieus, ...donData } = req.body;
        const newDon = await DonDangKy.create(donData, { transaction });
        if (Array.isArray(taiLieus)) {
            for (const tl of taiLieus) {
                if ( !tl.trangThai) {
                    throw new Error("Thiếu trường loaiTaiLieu hoặc trangThai trong tài liệu");
                }

                await TaiLieu.create({
                    maDon: newDon.maDonDangKy,  // Lấy maDon từ đơn vừa tạo
                    tenTaiLieu: tl.tenTaiLieu,
                    trangThai: tl.trangThai,
                    linkTaiLieu: tl.linkTaiLieu || null, // Có thể null
                }, { transaction });
            }
        }

        await transaction.commit();
        res.status(201).json({ message: "Tạo đơn đăng ký thành công", don: newDon });

    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ message: error.message });
    }
};


export const updateApplication = async (req, res) => {
    const t = await DonDangKy.sequelize.transaction(); // Transaction
    try {
        const { maDonDangKy, taiLieus, ...updateData } = req.body;
        if (!maDonDangKy) return res.status(400).json({ message: "Thiếu mã đơn đăng ký" });

        const don = await DonDangKy.findByPk(maDonDangKy);
        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        await don.update(updateData, { transaction: t });
        if (Array.isArray(taiLieus)) {
            await TaiLieu.destroy({ where: { maDonDangKy }, transaction: t });
            for (const taiLieu of taiLieus) {
                await TaiLieu.create({
                    ...taiLieu,
                    maDonDangKy
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

