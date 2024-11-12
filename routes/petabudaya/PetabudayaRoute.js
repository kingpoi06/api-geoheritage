import express from "express";
import {
  getPetabudaya,
//   getNewsById,
  getPetabudayaById,
  createPetabudaya,
  updatePetabudaya,
  deletePetabudaya,
} from "../../controllers/petabudaya/Petabudaya.js";
import { adminOnly } from "../../middleware/userOnly.js";
import upload from "../../middleware/multerConfig.js";
import { verifyToken, verifyUser } from "../../middleware/verify.js";


const router = express.Router();

router.get("/petabudaya", getPetabudaya);
router.get("/petabudaya/:uuid", getPetabudayaById);
// router.get("/news/:id", getNewsById);
router.post("/petabudaya/upload", verifyToken, verifyUser, adminOnly, upload.single('image'), createPetabudaya);
router.put("/petabudaya/:uuid", verifyToken, verifyUser, adminOnly, updatePetabudaya);
router.delete("/petabudaya/:uuid", verifyToken, verifyUser, adminOnly, deletePetabudaya);

export default router;
