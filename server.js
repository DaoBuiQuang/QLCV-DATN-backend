import express from "express";
 
import productRouter from "./src/routers/product.js";
import courseRouter from "./src/routers/courseRouter.js";
import { connectDB } from "./src/config/db.js";
import { syncDatabase } from "./src/model/index.js";

 
const app = express();
app.use(express.json());
app.use("/api", productRouter);
app.use("/api", courseRouter)
connectDB();
  // Kết nối MySQL
syncDatabase();
 
// Khởi động server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});