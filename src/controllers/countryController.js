import { Country } from "../model/quocGiaModel.js";

export const getCountry =  async (req, res) => {
    try{
        const country = await Country.findAll();
        if(country.length === 0){
            return res.status(404).json({ message: "Không có quốc gia nào" });
        }
        res.status(200).json(country);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getCountryById = async (req, res) => {
    try{
        const country = await Country.findByPk(req.params.id);
        if(!country){
            return res.status(404).json({message: "Quốc gia không tồn tại"})
        }
        res.status(200).json(country)

    }catch(error){
        res.status(500).json({message: error.message})
    }
}
export const addCountry = async (req, res) => {
    try{
        const {countryId, countryName} = req.body;
        if (!countryId || !countryName) {
            return res.status(400).json({ message: "Điền đầy đủ các thông tin" });
        }
        const newCoutry = await Country.create({countryId, countryName});
        res.status(201).json(newCoutry)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

// export const updateCountry = async(req, res) =>{
//     try{
//         const {id} = req.params;
//         const {caseTypeName} = req.body;

//         const caseType = await CaseType.findByPk(id);
//         if (!caseType) {
//             return res.status(404).json({ message: "Loại vụ việc không tồn tại" });
//         }
//         caseType.caseTypeName = caseTypeName;
//         await caseType.save();
//         res.status(200).json({message: "Cập nhập loại vụ việc thành công", caseType})
//     }catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// export const deleteCaseType = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const caseType = await CaseType.findByPk(id);

//         if (!caseType) {
//             return res.status(404).json({ message: "Loại vụ việc không tồn tại" });
//         }

//         await caseType.destroy();
//         res.status(200).json({ message: "Xóa loại vụ việc thành công" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };