import { Op } from "sequelize";
import { CaseFile } from "../model/caseFileModel.js";
import { Staff_CaseFile } from "../model/staff_caseFileModel.js";
import { Staff } from "../model/staffModel.js";
import { Customer } from "../model/khanhHangCuoiModel.js";
import { CaseType } from "../model/caseTypeModel.js";
import { Country } from "../model/quocGiaModel.js";

// Lấy tất cả hồ sơ
export const getAllCaseFiles = async (req, res) => {
    try {
        const caseFiles = await CaseFile.findAll({
            include: [
                { model: Customer, attributes: ["customerId", "customerName"] },
                { model: CaseType, attributes: ["caseTypeId", "caseTypeName"] },
                { model: Country, attributes: ["countryId", "countryName"] },
            ],
        });
        res.status(200).json(caseFiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết hồ sơ theo caseFileId
export const getCaseFileById = async (req, res) => {
    try {
        const { caseFileId } = req.params;

        const caseFile = await CaseFile.findByPk(caseFileId, {
            include: [
                { model: Customer, attributes: ["customerId", "customerName"] },
                { model: CaseType, attributes: ["caseTypeId", "caseTypeName"] },
                { model: Country, attributes: ["countryId", "countryName"] },
            ],
        });

        if (!caseFile) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
        }

        res.status(200).json(caseFile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchCaseFilesCombined = async (req, res) => {
    try {
        const { staffId, staffName, keyword, customerName } = req.body;

        let whereCondition = {};

        // Nếu có từ khóa, tìm theo mô tả hoặc trạng thái
        if (keyword) {
            whereCondition[Op.or] = [
                { description: { [Op.like]: `%${keyword}%` } },
                { status: { [Op.like]: `%${keyword}%` } },
            ];
        }
        let staffIds = [];
        if (staffId || staffName) {
            const staffCondition = {};
            if (staffId) staffCondition.staffId = staffId;
            if (staffName) staffCondition.staffName = { [Op.like]: `%${staffName}%` };

            const staffList = await Staff.findAll({
                where: staffCondition,
                attributes: ["staffId"],
            });

            staffIds = staffList.map(staff => staff.staffId);
        }
        if (staffIds.length > 0) {
            const staffCaseFiles = await Staff_CaseFile.findAll({
                where: { staffId: { [Op.in]: staffIds } },
                attributes: ["caseFileId"],
            });

            const caseFileIds = staffCaseFiles.map(item => item.caseFileId);
            whereCondition.caseFileId = caseFileIds.length > 0 ? { [Op.in]: caseFileIds } : null;
        }

        // Nếu có tên khách hàng, tìm theo tên khách hàng
        if (customerName) {
            const customers = await Customer.findAll({
                where: { customerName: { [Op.like]: `%${customerName}%` } },
                attributes: ["customerId"],
            });

            const customerIds = customers.map(item => item.customerId);
            whereCondition.customerId = customerIds.length > 0 ? { [Op.in]: customerIds } : null;
        }

        // Tìm kiếm hồ sơ dựa trên các điều kiện trên
        const caseFiles = await CaseFile.findAll({
            where: whereCondition,
            include: [
                { model: Customer, attributes: ["customerId", "customerName"] },
                { model: CaseType, attributes: ["caseTypeId", "caseTypeName"] },
                { model: Country, attributes: ["countryId", "countryName"] },
            ],
        });

        if (caseFiles.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ phù hợp" });
        }

        res.status(200).json(caseFiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm hồ sơ mới
export const createCaseFile = async (req, res) => {
    try {
        const { caseFileId, customerId, description, receivedDate, processedDate, caseTypeId, countryId, status } = req.body;

        const newCaseFile = await CaseFile.create({
            caseFileId,
            customerId,
            description,
            receivedDate,
            processedDate,
            caseTypeId,
            countryId,
            status,
        });

        res.status(201).json(newCaseFile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin hồ sơ
export const updateCaseFile = async (req, res) => {
    try {
        const { caseFileId } = req.params;
        const { customerId, description, receivedDate, processedDate, caseTypeId, countryId, status } = req.body;

        const caseFile = await CaseFile.findByPk(caseFileId);
        if (!caseFile) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
        }

        await caseFile.update({ customerId, description, receivedDate, processedDate, caseTypeId, countryId, status });

        res.status(200).json({ message: "Cập nhật hồ sơ thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa hồ sơ
export const deleteCaseFile = async (req, res) => {
    try {
        const { caseFileId } = req.params;

        const caseFile = await CaseFile.findByPk(caseFileId);
        if (!caseFile) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
        }

        await caseFile.destroy();

        res.status(200).json({ message: "Xóa hồ sơ thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
