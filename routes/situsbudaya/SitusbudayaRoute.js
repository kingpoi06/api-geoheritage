import express from "express";
import {
    getSitusbudaya,
//   getNewsById,
  getSitusbudayaById,
  createSitusbudaya,
  updateSitusbudaya,
  deleteSitusbudaya,
} from "../../controllers/situsbudaya/Situsbudaya.js";
import { adminOnly } from "../../middleware/userOnly.js";
import upload from "../../middleware/multerConfig.js";
import { verifyToken, verifyUser } from "../../middleware/verify.js";


const router = express.Router();

router.get("/situsbudaya", getSitusbudaya);
router.get("/situsbudaya/:uuid", getSitusbudayaById);
// router.get("/news/:id", getNewsById);
router.post("/situsbudaya/upload", verifyToken, verifyUser, adminOnly, upload.single('image'), createSitusbudaya);
router.put("/situsbudaya/:uuid", verifyToken, verifyUser, adminOnly, updateSitusbudaya);
router.delete("/situsbudaya/:uuid", verifyToken, verifyUser, adminOnly, deleteSitusbudaya);

export default router;
