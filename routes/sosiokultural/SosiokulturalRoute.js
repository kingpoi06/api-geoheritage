import express from "express";
import {
  getSosiokultural,
//   getNewsById,
  getSosiokulturalById,
  createSosiokultural,
  updateSosiokultural,
  deleteSosiokultural,
} from "../../controllers/sosiokultural/Sosiokultural.js";
import { adminOnly } from "../../middleware/userOnly.js";
import upload from "../../middleware/multerConfig.js";
import { verifyToken, verifyUser } from "../../middleware/verify.js";

const router = express.Router();

router.get("/sosiokultural", getSosiokultural);
router.get("/sosiokultural/:uuid", getSosiokulturalById);
// router.get("/news/:id", getNewsById);
router.post("/sosiokultural/upload", verifyToken, verifyUser, adminOnly, upload.single('image'), createSosiokultural);
router.put("/sosiokultural/:uuid", verifyToken, verifyUser, adminOnly, updateSosiokultural);
router.delete("/sosiokultural/:uuid", verifyToken, verifyUser, adminOnly, deleteSosiokultural);

export default router;
