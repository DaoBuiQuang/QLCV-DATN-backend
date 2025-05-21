import express from "express";
import dotenv from "dotenv";
dotenv.config();

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
connectDB();
syncDatabase();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});