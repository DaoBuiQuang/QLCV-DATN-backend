import { DonDangKy } from "../models/donDangKyModel.js";
import { Op, Sequelize, literal } from "sequelize";
import { KhachHangCuoi } from "../models/khanhHangCuoiModel.js";
import { QuocGia } from "../models/quocGiaModel.js";
import { DoiTac } from "../models/doiTacModel.js";
import { HoSo_VuViec } from "../models/hoSoVuViecModel.js";
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
    let countOver30 = 0;
    let countOverdue = 0;

    const today = new Date();

    for (let app of applications) {
      if (!app.hanXuLy) continue; // Bỏ qua nếu không có hạn xử lý

      const hanXuLyDate = new Date(app.hanXuLy);
      if (isNaN(hanXuLyDate.getTime())) continue; // Tránh lỗi ngày không hợp lệ

      const diffDays = Math.floor((hanXuLyDate - today) / (1000 * 60 * 60 * 24));

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

export const getStatisticsByHanTraLoi = async (req, res) => {
    try {
        const applications = await DonDangKy.findAll();

        let countUnder7 = 0;
        let countUnder30 = 0;
        let countOverdue = 0;
        let countOver30 = 0;

        const today = new Date();

        for (let app of applications) {
            if (!app.hanTraLoi) continue; // Bỏ qua nếu không có hạn trả lời

            const hanTraLoiDate = new Date(app.hanTraLoi);
            if (isNaN(hanTraLoiDate.getTime())) continue; // Bỏ qua nếu ngày không hợp lệ

            const diffDays = Math.floor((hanTraLoiDate - today) / (1000 * 60 * 60 * 24));

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


export const getCustomerCountByCountry = async (req, res) => {
  try {
    const result = await KhachHangCuoi.findAll({
      attributes: [
        'maQuocGia',
        [Sequelize.fn('COUNT', Sequelize.col('maKhachHang')), 'count']
      ],
      where: {
        daXoa: false // Nếu bạn chỉ muốn lấy KH chưa bị xóa mềm
      },
      group: ['maQuocGia'],
      include: [
        {
          model: QuocGia,
          as: 'quocGia',
          attributes: ['tenQuocGia'],
        }
      ]
    });

    const formatted = result.map(row => ({
      maQuocGia: row.maQuocGia,
      tenQuocGia: row.quocGia?.tenQuocGia || 'Không có quốc gia',
      count: parseInt(row.getDataValue('count'))
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerCountByPartner = async (req, res) => {
  try {
    const data = await KhachHangCuoi.findAll({
      attributes: [
        'maDoiTac',
        [Sequelize.fn('COUNT', Sequelize.col('maKhachHang')), 'count']
      ],
      include: [
        {
          model: DoiTac,
          as: 'doiTac',
          attributes: ['tenDoiTac']
        }
      ],
      group: ['maDoiTac', 'doiTac.tenDoiTac'],
      order: [[Sequelize.literal('count'), 'DESC']]
    });

    // Map dữ liệu
    const mapped = data.map(row => ({
      maDoiTac: row.maDoiTac,
      tenDoiTac: row.doiTac?.tenDoiTac || 'Không có đối tác',
      count: parseInt(row.getDataValue('count'))
    }));

    // Lấy 10 đối tác đầu tiên (theo count giảm dần)
    const top10 = mapped.slice(0, 10);

    // Tính tổng số khách hàng còn lại (ngoài top 10)
    const othersCount = mapped.slice(10).reduce((sum, item) => sum + item.count, 0);

    // Nếu còn đối tác khác thì thêm 1 mục "Các đối tác khác"
    if (othersCount > 0) {
      top10.push({
        maDoiTac: 'others',
        tenDoiTac: 'Các đối tác khác',
        count: othersCount
      });
    }

    res.status(200).json(top10);
  } catch (error) {
    console.error("Lỗi khi lấy thống kê theo đối tác:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPartnerCountByCountry = async (req, res) => {
  try {
    const data = await DoiTac.findAll({
      attributes: [
        'maQuocGia',
        [Sequelize.fn('COUNT', Sequelize.col('maDoiTac')), 'count']
      ],
      //   where: {
      //     daXoa: false
      //   },
      include: [
        {
          model: QuocGia,
          as: 'quocGia',
          attributes: ['tenQuocGia']
        }
      ],
      group: ['maQuocGia', 'quocGia.tenQuocGia']
    });

    const mapped = data.map(row => ({
      maQuocGia: row.maQuocGia,
      tenQuocGia: row.quocGia?.tenQuocGia || 'Không có quốc gia',
      count: parseInt(row.getDataValue('count'))
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Lỗi khi lấy thống kê đối tác theo quốc gia:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCaseCountByCountry = async (req, res) => {
  try {
    const data = await HoSo_VuViec.findAll({
      attributes: [
        'maQuocGiaVuViec',
        [Sequelize.fn('COUNT', Sequelize.col('HoSo_VuViec.maHoSoVuViec')), 'count']
      ],
      include: [
        {
          model: QuocGia,
          as: 'quocGia', // alias phải trùng với alias bạn định nghĩa trong association
          attributes: ['tenQuocGia']
        }
      ],
      group: ['maQuocGiaVuViec', 'quocGia.maQuocGia', 'quocGia.tenQuocGia']
    });

    const mapped = data.map(row => ({
      maQuocGia: row.maQuocGiaVuViec,
      tenQuocGia: row.quocGia?.tenQuocGia || 'Không rõ',
      count: parseInt(row.getDataValue('count'))
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Lỗi khi lấy thống kê vụ việc theo quốc gia:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCaseCountByPartner = async (req, res) => {
  try {
    const data = await HoSo_VuViec.findAll({
      attributes: [
        'maDoiTac',
        [Sequelize.fn('COUNT', Sequelize.col('maHoSoVuViec')), 'count']
      ],
      include: [
        {
          model: DoiTac,
          as: 'doiTac',
          attributes: ['tenDoiTac']
        }
      ],
      group: ['maDoiTac', 'doiTac.tenDoiTac']
    });

    const mapped = data.map(row => ({
      maDoiTac: row.maDoiTac,
      tenDoiTac: row.doiTac?.tenDoiTac || 'Không có đối tác',
      count: parseInt(row.getDataValue('count'))
    }));

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Lỗi khi lấy thống kê vụ việc theo đối tác:", error);
    res.status(500).json({ message: error.message });
  }
};
