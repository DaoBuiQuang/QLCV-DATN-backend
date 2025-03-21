import { Petition } from "../models/petitionModel.js";
import { CaseFile } from "../models/caseFileModel.js";

export const getAllPetitions = async (req, res) => {
    try {
        const petitions = await Petition.findAll({
            include: [
                {
                    model: CaseFile,
                    attributes: ["caseFileId", "description"],
                },
            ],
        });
        res.json(petitions);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách petitions" });
    }
};

export const getPetitionById = async (req, res) => {
    try {
        const { id } = req.params;
        const petition = await Petition.findByPk(id, {
            include: [
                {
                    model: CaseFile,
                    attributes: ["caseFileId", "description"],
                },
            ],
        });

        if (!petition) {
            return res.status(404).json({ error: "Không tìm thấy petition" });
        }
        res.json(petition);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy thông tin petition" });
    }
};

export const createPetition = async (req, res) => {
    try {
        const newPetition = await Petition.create(req.body);
        res.status(201).json(newPetition);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi tạo petition" });
    }
};

export const updatePetition = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Petition.update(req.body, {
            where: { petitionId: id },
        });

        if (!updated) {
            return res.status(404).json({ error: "Không tìm thấy petition" });
        }

        const updatedPetition = await Petition.findByPk(id);
        res.json(updatedPetition);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật petition" });
    }
};

export const deletePetition = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Petition.destroy({
            where: { petitionId: id },
        });

        if (!deleted) {
            return res.status(404).json({ error: "Không tìm thấy petition" });
        }

        res.json({ message: "Đã xóa petition thành công" });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xóa petition" });
    }
};
