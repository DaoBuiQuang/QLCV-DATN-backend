import express from "express";
import productRouter from "./src/routers/product.js"; // Đảm bảo có .js

const app = express();

app.use("/products", productRouter); // "/products" ở đây sẽ gọi router.get("/")

app.listen(3000, () => {
    console.log("Server đang chạy tại http://localhost:3000");
});
