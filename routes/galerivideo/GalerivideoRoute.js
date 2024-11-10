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


const router = express.Router();

router.get("/galerivideo", getGalerivideo);
router.get("/galerivideo/:id", getGalerivideoById);
router.post("/galerivideo/upload", adminOnly, createGalerivideo);
router.patch("/galerivideo/:id", adminOnly, updateGalerivideo);
router.delete("/galerivideo/:id", adminOnly, deletegalerivideo);

export default router;
