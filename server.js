import express from "express";
import dotenv from "dotenv";

dotenv.config(); // ✅ Đặt lên đầu tiên

import productRouter from "./src/routers/product.js";
import courseRouter from "./src/routers/courseRouter.js";
import authRouter from "./src/routers/authRouter.js";
import { connectDB } from "./src/config/db.js";
import { syncDatabase } from "./src/model/index.js";

const app = express();
app.use(express.json());
app.use("/api", productRouter);
app.use("/api", courseRouter);
app.use("/api", authRouter);

connectDB();
syncDatabase();

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
