import express from "express";
import {
  getGeoarkeologi,
//   getNewsById,
  getGeoarkeologiById,
  createGeoarkeologi,
  updateGeoarkeologi,
  deleteGeoarkeologi,
} from "../../controllers/geoarkeologi/Geoarkeologi.js";
import { adminOnly } from "../../middleware/userOnly.js";
import upload from "../../middleware/multerConfig.js";
import { verifyToken, verifyUser } from "../../middleware/verify.js";



const router = express.Router();

router.get("/geoarkeologi", getGeoarkeologi);
router.get("/geoarkeologi/:uuid", getGeoarkeologiById);
// router.get("/news/:id", getNewsById);
router.post("/geoarkeologi/upload", verifyToken, verifyUser, adminOnly, upload.single('image'), createGeoarkeologi);
router.put("/geoarkeologi/:uuid", verifyToken, verifyUser, adminOnly, updateGeoarkeologi);
router.delete("/geoarkeologi/:uuid", verifyToken, verifyUser, adminOnly, deleteGeoarkeologi);

export default router;
