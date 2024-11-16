import express from "express";
import { refreshToken } from "../../controllers/login/RefreshToken.js";

const router = express.Router();

router.post("/token", refreshToken);
router.get("/token", refreshToken);


export default router;
