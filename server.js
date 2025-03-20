import express from "express";

import customerRouter from "./src/routers/customerRouter.js";
import caseTypeRouter from "./src/routers/caseTypeRouter.js";
import partnerRouter from "./src/routers/partnerRouter.js";
import countryRouter from "./src/routers/countryRouter.js"
import { connectDB } from "./src/config/db.js";
import { syncDatabase } from "./src/model/index.js";

const app = express();
app.use(express.json());

app.get('/', (req, res)=>{
  return res.send('hello word');
})
app.use("/api", customerRouter)
app.use("/api", caseTypeRouter)
app.use("/api", partnerRouter)
app.use("/api", countryRouter)
connectDB();
syncDatabase();

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});