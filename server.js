import express from "express";

// import customerRouter from "./src/routers/customerRouter.js";
// import caseTypeRouter from "./src/routers/caseTypeRouter.js";
// import partnerRouter from "./src/routers/partnerRouter.js";
// import countryRouter from "./src/routers/countryRouter.js"
// import caseFileRouter from "./src/routers/caseFileRouter.js"
// import documentRouter from "./src/routers/documentRouter.js"
// import staffCaseFileRouter from "./src/routers/staff_caseFileRouter.js"
// import staffRouter from "./src/routers/staffRouter.js"
// import petitionRouter from "./src/routers/petitionRouter.js"
import authRouter from "./src/routers/authRouter.js"
import nhanSuRouter from "./src/routers/nhanSuRouter.js"
import quocGiaRouter from "./src/routers/quocgiaRouter.js"
import { connectDB } from "./src/config/db.js";
import { syncDatabase } from "./src/model/index.js";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res)=>{
  return res.send('hello word');
})
app.use("/api", authRouter)
app.use("/api", nhanSuRouter)
app.use("/api", quocGiaRouter)
// app.use("/api", caseTypeRouter)
// app.use("/api", partnerRouter)
// app.use("/api", countryRouter)
// app.use("/api", caseFileRouter)
// app.use("/api", documentRouter)
// app.use("/api", staffCaseFileRouter)
// app.use("/api", staffRouter)
// app.use("/api", petitionRouter)
connectDB();
syncDatabase();

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});