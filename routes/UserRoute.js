import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/Users.js";
import { adminOnly } from "../middleware/userOnly.js";

const router = express.Router();

router.get("/users", adminOnly, getUsers);
router.get("/users/:id", adminOnly, getUserById);
router.post("/users", createUser);
router.patch("/users/:id", adminOnly, updateUser);
router.delete("/users/:id", adminOnly, deleteUser);

export default router;
