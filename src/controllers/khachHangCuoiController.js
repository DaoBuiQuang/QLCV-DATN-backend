import { Op } from "sequelize";
import { KhachHangCuoi } from "../models/khanhHangCuoiModel.js";
import { DoiTac } from "../models/doiTacModel.js";
import { QuocGia } from "../models/quocGiaModel.js";
import { NganhNghe } from "../models/nganhNgheModel.js";

export const generateCustomerCode = async (req, res) => {
    try {
        const { tenVietTatKH } = req.body;

        if (!tenVietTatKH) {
            return res.status(400).json({ message: "Vui lòng nhập tên viết tắt khách hàng" });
        }
        const prefix = tenVietTatKH.trim().charAt(0).toUpperCase();
        const maxCustomer = await KhachHangCuoi.findOne({
            where: { maKhachHang: { [Op.like]: `${prefix}%` } },
            order: [['maKhachHang', 'DESC']]
        });
        let nextNumber = 1;
        if (maxCustomer) {
            const currentNumber = parseInt(maxCustomer.maKhachHang.substring(1)); 
            nextNumber = currentNumber + 1;
        }
        const maKhachHang = `${prefix}${String(nextNumber).padStart(5, '0')}`;

        res.status(200).json({ maKhachHang });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomerNamesAndCodes = async (req, res) => {
    try {
        const { tenKhachHang } = req.body;
        const whereCondition = {};
        if (tenKhachHang) {
            whereCondition.tenKhachHang = { [Op.like]: `%${tenKhachHang}%` };
        }

        const customers = await KhachHangCuoi.findAll({
            where: whereCondition,
            attributes: ['maKhachHang', 'tenKhachHang'],
        });

        if (!customers.length) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng nào" });
        }

        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getCustomers = async (req, res) => {
    try {
        const { tenKhachHang, maDoiTac, maQuocGia, maNganhNghe } = req.body;

        const whereCondition = {};
        if (tenKhachHang) {
            whereCondition.tenKhachHang = { [Op.like]: `%${tenKhachHang}%` };
        }
        if (maDoiTac) {
            whereCondition.maDoiTac = maDoiTac;
        }
        if (maQuocGia) {
            whereCondition.maQuocGia = maQuocGia;
        }
        if (maNganhNghe) {
            whereCondition.maNganhNghe = maNganhNghe;
        }

        const customers = await KhachHangCuoi.findAll({
            where: whereCondition,
            include: [
                { model: DoiTac, as: "doiTac", attributes: ["tenDoiTac"] },
                { model: QuocGia, as: "quocGia", attributes: ["tenQuocGia"] },
                { model: NganhNghe, as: "nganhNghe", attributes: ["tenNganhNghe"] },
            ],
        });

        if (!customers.length) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng nào" });
        }

        // Format kết quả
        const result = customers.map(cus => ({
            maKhachHang: cus.maKhachHang,
            tenKhachHang: cus.tenKhachHang,
            moTa: cus.moTa,
            diaChi: cus.diaChi,
            sdt: cus.sdt,
            ngayTao: cus.ngayTao,
            ghiChu: cus.ghiChu,
            trangThai: cus.trangThai,
            ngayCapNhap: cus.ngayCapNhap,
            maKhachHangCu: cus.maKhachHangCu,
            tenDoiTac: cus.doiTac?.tenDoiTac || null,
            tenQuocGia: cus.quocGia?.tenQuocGia || null,
            tenNganhNghe: cus.nganhNghe?.tenNganhNghe || null
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Lấy khách hàng theo ID
export const getCustomerById = async (req, res) => {
    try {
        const { maKhachHang } = req.body;

        if (!maKhachHang) {
            return res.status(400).json({ message: "Thiếu mã khách hàng" });
        }

        const customer = await KhachHangCuoi.findByPk(maKhachHang, {
            include: [
                { model: DoiTac, as: "doiTac" },
                { model: QuocGia, as: "quocGia" },
                { model: NganhNghe, as: "nganhNghe" }
            ]
        });

        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Thêm khách hàng
export const addCustomer = async (req, res) => {
    try {
        const {
            maKhachHang, tenKhachHang, maDoiTac, moTa,
            diaChi, sdt, ghiChu, maQuocGia, trangThai,
            maKhachHangCu, maNganhNghe
        } = req.body;

        if (!maKhachHang || !tenKhachHang) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ mã và tên khách hàng" });
        }

        const newCustomer = await KhachHangCuoi.create({
            maKhachHang, tenKhachHang, maDoiTac, moTa,
            diaChi, sdt, ghiChu, maQuocGia, trangThai,
            maKhachHangCu, maNganhNghe
        });

        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Cập nhật khách hàng
export const updateCustomer = async (req, res) => {
    try {
        const {
            maKhachHang, tenKhachHang, maDoiTac, moTa,
            diaChi, sdt, ghiChu, maQuocGia, trangThai,
            maKhachHangCu, maNganhNghe
        } = req.body;

        const customer = await KhachHangCuoi.findByPk(maKhachHang);
        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        // Cập nhật thông tin
        customer.tenKhachHang = tenKhachHang || customer.tenKhachHang;
        customer.maDoiTac = maDoiTac || customer.maDoiTac;
        customer.moTa = moTa || customer.moTa;
        customer.diaChi = diaChi || customer.diaChi;
        customer.sdt = sdt || customer.sdt;
        customer.ghiChu = ghiChu || customer.ghiChu;
        customer.maQuocGia = maQuocGia || customer.maQuocGia;
        customer.trangThai = trangThai || customer.trangThai;
        customer.maKhachHangCu = maKhachHangCu || customer.maKhachHangCu;
        customer.maNganhNghe = maNganhNghe || customer.maNganhNghe;
        customer.ngayCapNhap = new Date();

        await customer.save();
        res.status(200).json({ message: "Cập nhật khách hàng thành công", customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Xóa khách hàng
export const deleteCustomer = async (req, res) => {
    try {
        const { maKhachHang } = req.body;

        const customer = await KhachHangCuoi.findByPk(maKhachHang);
        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        await customer.destroy();
        res.status(200).json({ message: "Xóa khách hàng thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
