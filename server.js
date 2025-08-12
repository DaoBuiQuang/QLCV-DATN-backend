import express from "express";
import dotenv from "dotenv";
dotenv.config();
import os from "os";
import authRouter from "./src/routers/authRouter.js"
import nhanSuRouter from "./src/routers/nhanSuRouter.js"
import quocGiaRouter from "./src/routers/quocgiaRouter.js"
import loaiVuViecRouter from "./src/routers/loaiVuViecRouter.js"
import doiTacRouter from "./src/routers/doiTacRouter.js"
import khachHangCuoi from "./src/routers/khachHangCuoiRouter.js"
import hoSoVuViec from "./src/routers/hoSoVuViecRouter.js"
import loaiDonRouter from "./src/routers/loaiDonRouter.js"
import donDangKyRouter from "./src/routers/donDangKyRouter.js"
import nhanHieuRouter from "./src/routers/nhanHieuRouter.js"
import sanPham_DichVuRouter from "./src/routers/sanPham_DichVuRouter.js"
import pushNotificationRouter from "./src/routers/pushNotificationRouter.js";
import dashBoardRouter from "./src/routers/dashBoardRouter.js"
import uploadRouter from "./src/routers/uploadRouter.js";
import rollbackRouter from "./src/routers/rollbackRouter.js";
import donDangKyNhanHieu_KHRouter from "./src/routers/donDangKyNhanHieu_KHRouter.js";
// import nganhNgheRouter from "./src/routers/nganhNgheRouter.js"
import { connectDB } from "./src/config/db.js";
import { syncDatabase } from "./src/models/index.js";

import cors from "cors";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
app.use(cors());
app.get('/', (req, res)=>{
  return res.send('hello word');
})
app.use("/api", authRouter)
app.use("/api", nhanSuRouter)
app.use("/api", quocGiaRouter)
app.use("/api", loaiVuViecRouter)
app.use("/api", doiTacRouter)
app.use("/api", khachHangCuoi)
app.use("/api", hoSoVuViec)
app.use("/api", loaiDonRouter)
app.use("/api", donDangKyRouter)
app.use("/api", nhanHieuRouter)
app.use("/api", sanPham_DichVuRouter)
app.use("/api", dashBoardRouter)
// app.use("/api", nganhNgheRouter)
app.use("/api", pushNotificationRouter);
app.use("/api", uploadRouter);
app.use("/api", rollbackRouter);
app.use("/api", donDangKyNhanHieu_KHRouter);
connectDB();
syncDatabase();
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address; // Trả về IP nội bộ (LAN)
      }
    }
  }
  return "localhost"; // fallback nếu không có IP nào
};

const IP = getLocalIp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://${IP}:${PORT}`);
});
