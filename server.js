import express from "express";
 
import customerRouter from "./src/routers/customerRouter.js";
import { connectDB } from "./src/config/db.js";
import { syncDatabase } from "./src/model/index.js";

 
const app = express();
app.use(express.json());
app.get('/', (req, res)=>{
  return res.send('hello word');
})
app.use("/api", customerRouter)
connectDB();
  // Kết nối MySQL
syncDatabase();
 
// Khởi động server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});