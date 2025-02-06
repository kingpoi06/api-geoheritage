import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/Users.js";
import { adminOnly } from "../middleware/userOnly.js";
import { verifyToken, verifyUser } from "../middleware/verify.js";

const router = express.Router();

router.get("/users", verifyToken, verifyUser, adminOnly, getUsers);
router.get("/users/:id", verifyToken, verifyUser, adminOnly, getUserById);
router.post("/users", createUser);
router.patch("/users/:id", verifyToken, verifyUser, adminOnly, updateUser);
router.delete("/users/:id",verifyToken, verifyUser, adminOnly, deleteUser);

export default router;
