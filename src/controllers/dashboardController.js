import { DonDangKy } from "../models/donDangKyModel.js";
import { Op, Sequelize, literal } from "sequelize";
export const getStatisticsByStatus = async (req, res) => {
    try {
        const data = await DonDangKy.findAll({
            attributes: [
                'trangThaiDon',
                [Sequelize.fn('COUNT', Sequelize.col('maDonDangKy')), 'count']
            ],
            group: ['trangThaiDon']
        });

        const result = data.map(row => ({
            trangThaiDon: row.trangThaiDon,
            count: parseInt(row.getDataValue('count'))
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStatisticsByHanXuLy = async (req, res) => {
    try {
        const applications = await DonDangKy.findAll();

        let countUnder7 = 0;
        let countUnder30 = 0;
        let countOverdue = 0;
        let countOver30 = 0;

        const today = new Date();

        for (let app of applications) {
            let duKienDate = null;

            switch (app.trangThaiDon) {
                case "Hoàn thành hồ sơ tài liệu":
                    duKienDate = app.ngayHoanThanhHoSoTaiLieu_DuKien;
                    break;
                case "Thẩm định nội dung":
                    duKienDate = app.ngayKQThamDinhND_DuKien;
                    break;
                case "Thẩm định hình thức":
                    duKienDate = app.ngayKQThamDinhHinhThuc_DuKien;
                    break;
                case "Công bố đơn":
                    duKienDate = app.ngayCongBoDonDuKien;
                    break;
            }

            if (!duKienDate) continue;

            const targetDate = new Date(duKienDate);
            if (isNaN(targetDate.getTime())) continue;

            const diffDays = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24));

            if (diffDays < 0) countOverdue++;
            else if (diffDays < 7) countUnder7++;
            else if (diffDays < 30) countUnder30++;
            else countOver30++;
        }

        res.status(200).json({
            under7Days: countUnder7,
            under30Days: countUnder30,
            over30Days: countOver30,
            overdue: countOverdue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

