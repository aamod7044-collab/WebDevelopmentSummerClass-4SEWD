import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/todoController.js";

const router = Router();

router.use(requireAuth);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
