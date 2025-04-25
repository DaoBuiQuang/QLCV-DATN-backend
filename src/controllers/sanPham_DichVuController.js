import { SanPham_DichVu } from "../models/sanPham_DichVuModel.js";

export const getAllSanPhamDichVu = async (req, res) => {
    try {
        const { search } = req.body;
        let items;

        if (search) {
            items = await SanPham_DichVu.findAll({
                where: {
                    tenSPDV: {
                        [Op.like]: `%${search}%`
                    }
                }
            });
        } else {
            items = await SanPham_DichVu.findAll();
        }

        if (items.length === 0) {
            return res.status(404).json({ message: "Không có sản phẩm/dịch vụ nào" });
        }

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSanPhamDichVuById = async (req, res) => {
    try {
        const { maSPDV } = req.body;

        if (!maSPDV) {
            return res.status(400).json({ message: "Thiếu mã sản phẩm/dịch vụ" });
        }

        const item = await SanPham_DichVu.findByPk(maSPDV);

        if (!item) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm/dịch vụ" });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addSanPhamDichVu = async (req, res) => {
    try {
        const { maSPDV, tenSPDV, moTa } = req.body;

        if (!maSPDV || !tenSPDV) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ mã và tên sản phẩm/dịch vụ" });
        }

        const newItem = await SanPham_DichVu.create({ maSPDV, tenSPDV, moTa });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSanPhamDichVu = async (req, res) => {
    try {
        const { maSPDV, tenSPDV, moTa } = req.body;

        if (!maSPDV || !tenSPDV) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        const item = await SanPham_DichVu.findByPk(maSPDV);
        if (!item) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm/dịch vụ" });
        }

        item.tenSPDV = tenSPDV;
        item.moTa = moTa;
        await item.save();

        res.status(200).json({ message: "Cập nhật thành công", item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSanPhamDichVu = async (req, res) => {
    try {
        const { maSPDV } = req.body;

        if (!maSPDV) {
            return res.status(400).json({ message: "Thiếu mã sản phẩm/dịch vụ" });
        }

        const item = await SanPham_DichVu.findByPk(maSPDV);
        if (!item) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm/dịch vụ" });
        }

        await item.destroy();

        res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
