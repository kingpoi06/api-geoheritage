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


const router = express.Router();

router.get("/galeripoto", getGaleripoto);
router.get("/galeripoto/:id", getGaleripotoById);
router.post("/galeripoto/upload", adminOnly, upload.single('image'), createGaleripoto);
router.patch("/galeripoto/:id", adminOnly, updateGaleripoto);
router.delete("/galeripoto/:id", adminOnly, deleteGaleripoto);

export default router;
