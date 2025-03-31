import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Không có token, vui lòng đăng nhập" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), "my_secret_key");
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).json({ message: "Token không hợp lệ" });
    }
};
