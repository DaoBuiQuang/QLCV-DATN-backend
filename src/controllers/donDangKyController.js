import { DonDangKy } from "../models/donDangKyModel.js";



export const getAllApplication = async (req, res) => {
    try {
        const list = await DonDangKy.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const { maDonDangKi } = req.body;
        if (!maDonDangKi) return res.status(400).json({ message: "Thiếu maDonDangKi trong body" });

        const don = await DonDangKy.findByPk(maDonDangKi);
        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        res.json(don);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createApplication = async (req, res) => {
    try {
        const newDon = await DonDangKy.create(req.body);
        res.status(201).json(newDon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateApplication = async (req, res) => {
    try {
        const { maDonDangKi, ...updateData } = req.body;
        if (!maDonDangKi) return res.status(400).json({ message: "Thiếu maDonDangKi trong body" });

        const don = await DonDangKy.findByPk(maDonDangKi);
        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        await don.update(updateData);
        res.json(don);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const { maDonDangKi } = req.body;
        if (!maDonDangKi) return res.status(400).json({ message: "Thiếu maDonDangKi trong body" });

        const don = await DonDangKy.findByPk(maDonDangKi);
        if (!don) return res.status(404).json({ message: "Không tìm thấy đơn đăng ký" });

        await don.destroy();
        res.json({ message: "Đã xoá đơn đăng ký" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

