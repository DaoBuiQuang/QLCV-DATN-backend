import express from "express";
const router = express.Router();

router.get("/", (req, res) => {  
    console.log("Hello from /products");
    res.send("Check console for message");
});

export default router;
