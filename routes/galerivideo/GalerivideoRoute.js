import express from "express";
import {
  getGalerivideo,
  getGalerivideoById,
  createGalerivideo,
  updateGalerivideo,
  deletegalerivideo,
} from "../../controllers/galerivideo/Galerivideo.js";
import { adminOnly } from "../../middleware/userOnly.js";
import upload from "../../middleware/multerConfig.js";
import { verifyToken, verifyUser } from "../../middleware/verify.js";



const router = express.Router();

router.get("/galerivideo", getGalerivideo);
router.get("/galerivideo/:uuid", getGalerivideoById);
router.post("/galerivideo/upload", verifyToken, verifyUser, adminOnly, upload.single('image'), createGalerivideo);
router.patch("/galerivideo/:uuid", verifyToken, verifyUser, adminOnly, updateGalerivideo);
router.delete("/galerivideo/:uuid", verifyToken, verifyUser, adminOnly, deletegalerivideo);

export default router;
