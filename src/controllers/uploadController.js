import multer from "multer";
import xlsx from "xlsx";
import { sequelize } from "../config/db.js";

// Cấu hình multer để nhận file excel từ client
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadExcel = [
  upload.single("excel"),
  async (req, res) => {
    try {
      // Đọc dữ liệu từ file Excel
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);

      let insertedCount = 0;
      let skippedCount = 0;

      for (const row of rows) {
        const {
          maKhachHang,
          tenVietTatKH,
          tenKhachHang,
          maQuocGia,
          maDoiTac,
          nguoiLienHe,
          moTa,
          ghiChu,
          daXoa,
        } = row;

        // Kiểm tra các trường bắt buộc
        if (!maKhachHang || !tenKhachHang) {
          skippedCount++;
          console.warn("⚠️ Bỏ qua dòng thiếu mã KH hoặc tên KH:", row);
          continue;
        }

        try {
          await sequelize.query(
            `
            INSERT INTO khachhangcuoi_excel
            (maKhachHang, tenVietTatKH, tenKhachHang, maQuocGia, maDoiTac, nguoiLienHe, moTa, ghiChu, daXoa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            {
              replacements: [
                maKhachHang ?? null,
                tenVietTatKH ?? null,
                tenKhachHang ?? null,
                maQuocGia ?? null,
                maDoiTac ?? null,
                nguoiLienHe ?? null,
                moTa ?? null,
                ghiChu ?? null,
                daXoa ?? 0,
              ],
            }
          );

          insertedCount++;
        } catch (err) {
          if (err.original?.code === "ER_DUP_ENTRY") {
            console.warn("⚠️ Dòng bị trùng mã KH, bỏ qua:", maKhachHang);
            skippedCount++;
            continue;
          } else {
            throw err; // Lỗi khác thì ném ra ngoài
          }
        }
      }

      res.status(200).json({
        message: `✅ Đã import xong Excel. Dòng thành công: ${insertedCount}, bị bỏ qua: ${skippedCount}`,
      });
    } catch (err) {
      console.error("❌ Lỗi import Excel:", err);
      res.status(500).json({ error: "Import thất bại." });
    }
  },
];

export const uploadExcelDoiTac = [
  upload.single("excel"),
  async (req, res) => {
    try {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);

      let insertedCount = 0;
      let skippedCount = 0;

      for (const row of rows) {
        const {
          maDoiTac,
          tenDoiTac,
          maQuocGia,
        } = row;

        // Kiểm tra các trường bắt buộc
        if (!maDoiTac || !tenDoiTac) {
          skippedCount++;
          console.warn("⚠️ Bỏ qua dòng thiếu thông tin bắt buộc:", row);
          continue;
        }

        try {
          await sequelize.query(
            `
            INSERT INTO doitac_excel
            (maDoiTac, tenDoiTac, maQuocGia, createdAt, updatedAt)
            VALUES (?, ?, ?, NOW(), NOW())
            `,
            {
              replacements: [
                maDoiTac ?? null,
                tenDoiTac ?? null,
                maQuocGia ?? null,
              ],
            }
          );

          insertedCount++;
        } catch (err) {
          if (err.original?.code === "ER_DUP_ENTRY") {
            console.warn("⚠️ Dòng bị trùng mã đối tác, bỏ qua:", maDoiTac);
            skippedCount++;
            continue;
          } else {
            throw err;
          }
        }
      }

      res.status(200).json({
        message: `✅ Đã import xong Excel. Dòng thành công: ${insertedCount}, bị bỏ qua: ${skippedCount}`,
      });
    } catch (err) {
      console.error("❌ Lỗi import Excel (Đối tác):", err);
      res.status(500).json({ error: "Import đối tác thất bại." });
    }
  },
];
function parseDate(input) {
  if (!input || typeof input !== "string") return null;

  const parts = input.split("/");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export const uploadExcelHoSoVuViec = [
  upload.single("excel"),
  async (req, res) => {
    try {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet, { raw: false });

      let insertedCount = 0;
      let skippedCount = 0;

      for (const row of rows) {
        const {
          maHoSoVuViec,
          maKhachHang,
          noiDungVuViec,
          ngayTiepNhan,
          maLoaiVuViec,
          maLoaiDon,
          maQuocGiaVuViec,
          trangThaiVuViec,
          buocXuLyHienTai,
          tenNhanHieu,
          soDon,
          ngayNopDon,
          ghiChu,
          soBang,
          // hanTraLoi,
          // hanXuLy,
          buocXuLy,
          trangThaiDon,
          nhomSPDV
        } = row;

        if (!maHoSoVuViec || !maKhachHang || !maQuocGiaVuViec) {
          skippedCount++;
          console.warn("⚠️ Bỏ qua do thiếu trường bắt buộc:", {
            maHoSoVuViec,
            maKhachHang,
            maQuocGiaVuViec
          });
          continue;
        }

        const transaction = await sequelize.transaction();
        try {
          await sequelize.query(`
            INSERT INTO hoso_vuviec_excel (
              maHoSoVuViec, maKhachHang,
              noiDungVuViec, ngayTiepNhan, maLoaiVuViec, maLoaiDon,
              maQuocGiaVuViec, trangThaiVuViec, buocXuLyHienTai,
              createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, {
            replacements: [
              maHoSoVuViec,
              maKhachHang,
              noiDungVuViec ?? null,
              parseDate(ngayTiepNhan),
              maLoaiVuViec ?? 'TM',
              maLoaiDon ?? '1',
              maQuocGiaVuViec,
              trangThaiVuViec ?? null,
              buocXuLyHienTai ?? null,
              new Date(),
              new Date()
            ],
            transaction
          });

          let maNhanHieu = null;
          let maDonDangKy = null;

          if (tenNhanHieu) {
            const nhanHieuResult = await sequelize.query(`
              INSERT INTO nhanhieu_excel (tenNhanHieu, createdAt, updatedAt)
              VALUES (?, NOW(), NOW())
            `, {
              replacements: [tenNhanHieu],
              transaction,
              type: sequelize.QueryTypes.INSERT
            });

            maNhanHieu = nhanHieuResult[0]; // ✅ insertId trả về tại index 0

            if (!maNhanHieu) {
              console.warn("⚠️ Không lấy được maNhanHieu, bỏ qua hồ sơ:", maHoSoVuViec);
              await transaction.rollback();
              skippedCount++;
              continue;
            }

            maDonDangKy = maHoSoVuViec;

            await sequelize.query(`
              INSERT INTO dondangkynhanhieu_excel (
                maDonDangKy, soDon, maHoSoVuViec, maNhanHieu, trangThaiDon,
               buocXuLy, ghiChu, ngayNopDon,
                soBang, 
                createdAt, updatedAt
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, {
              replacements: [
                maDonDangKy,
                soDon ?? null,
                maHoSoVuViec,
                maNhanHieu,
                trangThaiDon ?? null,
                // parseDate(hanTraLoi),
                // parseDate(hanXuLy),
                buocXuLy ?? null,
                ghiChu ?? null,
                parseDate(ngayNopDon),
                soBang ?? null,
                new Date(),
                new Date()
              ],
              transaction
            });

            if (nhomSPDV) {
              const maSPDVList = nhomSPDV.split(",").map(n => n.trim());

              for (const maSPDV of maSPDVList) {
                if (maSPDV) {
                  await sequelize.query(`
        INSERT INTO dondk_spdv_excel (maDonDangKy, maSPDV, createdAt, updatedAt)
        VALUES (?, ?, NOW(), NOW())
      `, {
                    replacements: [maDonDangKy, maSPDV],
                    transaction
                  });
                } else {
                  console.warn(`⚠️ Dòng maSPDV rỗng bị bỏ qua`);
                }
              }
            }
          }

          await transaction.commit();
          insertedCount++;
        } catch (err) {
          await transaction.rollback();
          if (err.original?.code === "ER_DUP_ENTRY") {
            console.warn("⚠️ Hồ sơ bị trùng mã, bỏ qua:", maHoSoVuViec);
            skippedCount++;
          } else {
            console.error("❌ Lỗi khi insert:", err);
            throw err;
          }
        }
      }

      res.status(200).json({
        message: `✅ Đã import hồ sơ: Thành công ${insertedCount}, Bỏ qua ${skippedCount}`
      });
    } catch (err) {
      console.error("❌ Lỗi tổng quát import:", err);
      res.status(500).json({ error: "Import hồ sơ thất bại." });
    }
  }
];




