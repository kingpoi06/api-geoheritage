import express from "express";
import {
  getGalerivideo,
  getGalerivideoById,
  createGalerivideo,
  updateGalerivideo,
  deletegalerivideo,
} from "../../controllers/galerivideo/Galerivideo.js";
import { adminOnly } from "../../middleware/userOnly.js";
// import upload from "../../middleware/multerConfig.js";
import { verifyToken, verifyUser } from "../../middleware/verify.js";



const router = express.Router();

router.get("/galerivideo", getGalerivideo);
router.get("/galerivideo/:id", getGalerivideoById);
router.post("/galerivideo/upload", verifyToken, verifyUser, adminOnly, createGalerivideo);
router.patch("/galerivideo/:id", verifyToken, verifyUser, adminOnly, updateGalerivideo);
router.delete("/galerivideo/:id", verifyToken, verifyUser, adminOnly, deletegalerivideo);

export default router;
