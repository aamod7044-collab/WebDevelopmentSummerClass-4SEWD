// src/routes/todoRoutes.js
import { Router } from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { validate } from "../middleware/validate.js";
import {
  createTodoValidator,
  updateTodoValidator,
  idParamValidator,
} from "../validators/todoValidator.js";

const router = Router();

router.get("/", getAllTodos);
router.get("/:id", idParamValidator, validate, getTodoById);
router.post("/", createTodoValidator, validate, createTodo);
router.put("/:id", updateTodoValidator, validate, updateTodo);
router.delete("/:id", idParamValidator, validate, deleteTodo);

export default router;
