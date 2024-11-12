import express from "express";
import {
  getNews,
//   getNewsById,
  getNewsByUuid,
  createNews,
  updateNews,
  deleteNews,
} from "../../controllers/news/News.js";
import { adminOnly } from "../../middleware/userOnly.js";
import upload from "../../middleware/multerConfig.js";
import { verifyToken, verifyUser } from "../../middleware/verify.js";



const router = express.Router();

router.get("/news", getNews);
router.get("/news/:uuid", getNewsByUuid);
// router.get("/news/:id", getNewsById);
router.post("/news/upload", verifyToken, verifyUser, adminOnly, upload.single('image'), createNews);
router.put("/news/:uuid", verifyToken, verifyUser, adminOnly, updateNews);
router.delete("/news/:uuid", verifyToken, verifyUser, adminOnly, deleteNews);

export default router;
