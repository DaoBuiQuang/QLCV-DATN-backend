import { CaseType } from "../model/caseTypeModel.js";

export const getCaseType =  async (req, res) => {
    try{
        const caseType = await CaseType.findAll();
        if(caseType.length === 0){
            return res.status(404).json({ message: "Không có loại vụ việc nào" });
        }
        res.status(200).json(caseType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getCaseTypeById = async (req, res) => {
    try{
        const caseType = await CaseType.findByPk(req.params.id);
        if(!caseType){
            return res.status(404).json({message: "Loại vụ việc không tồn tại"})
        }
        res.status(200).json(caseType)

    }catch(error){
        res.status(500).json({message: error.message})
    }
}
export const addCaseType = async (req, res) => {
    try{
        const {caseTypeId, caseTypeName} = req.body;
        if (!caseTypeId || !caseTypeName) {
            return res.status(400).json({ message: "Điền đầy đủ các thông tin" });
        }
        const newCaseType = await CaseType.create({caseTypeId, caseTypeName});
        res.status(201).json(newCaseType)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const updateCaseType = async(req, res) =>{
    try{
        const {id} = req.params;
        const {caseTypeName} = req.body;

        const caseType = await CaseType.findByPk(id);
        if (!caseType) {
            return res.status(404).json({ message: "Loại vụ việc không tồn tại" });
        }
        caseType.caseTypeName = caseTypeName;
        await caseType.save();
        res.status(200).json({message: "Cập nhập loại vụ việc thành công", caseType})
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCaseType = async (req, res) => {
    try {
        const { id } = req.params;
        const caseType = await CaseType.findByPk(id);

        if (!caseType) {
            return res.status(404).json({ message: "Loại vụ việc không tồn tại" });
        }

        await caseType.destroy();
        res.status(200).json({ message: "Xóa loại vụ việc thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};