import express from "express";
import {
  getGaleripoto,
  getGaleripotoById,
  createGaleripoto,
  updateGaleripoto,
  deleteGaleripoto,
} from "../../controllers/galeripoto/Galerifoto.js";
import { adminOnly } from "../../middleware/userOnly.js";
import upload from "../../middleware/multerConfig.js";
import { verifyToken, verifyUser } from "../../middleware/verify.js";



const router = express.Router();

router.get("/galeripoto", getGaleripoto);
router.get("/galeripoto/:uuid", getGaleripotoById);
router.post("/galeripoto/upload", verifyToken, verifyUser, adminOnly, upload.single('image'), createGaleripoto);
router.patch("/galeripoto/:uuid", verifyToken, verifyUser, adminOnly, updateGaleripoto);
router.delete("/galeripoto/:uuid", verifyToken, verifyUser, adminOnly, deleteGaleripoto);

export default router;
