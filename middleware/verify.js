import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ msg: "Please login in your account!" });
  }

  try {
    const user = await Users.findOne({
      where: {
        uuid: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found at Verify User" });
    }
    req.userDbId = user.id;
    next();
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    console.log("Token tidak ditemukan di header");
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Gagal memverifikasi token" });
    }

    req.userId = decoded.uuid;
    req.username = decoded.username;
    req.role = decoded.role;
    console.log("Token berhasil diverifikasi, userId:", req.userId);
    next();
  });
};

