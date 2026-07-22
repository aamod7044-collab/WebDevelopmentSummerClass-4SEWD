import { TodoService } from "../services/todoService.js";

export const getAllTodos = async (req, res) => {
  res.status(200).json(await TodoService.getAllTodos());
};

export const getTodoById = async (req, res) => {
  const todo = await TodoService.getTodoById(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: "Todo item not found" });
  }
  res.status(200).json(todo);
};

export const createTodo = async (req, res) => {
  const newTodo = await TodoService.createTodo(req.body);
  res.status(201).json(newTodo);
};

export const updateTodo = async (req, res) => {
  const updated = await TodoService.updateTodo(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.status(200).json(updated);
};

export const deleteTodo = async (req, res) => {
  const deleted = await TodoService.deleteTodo(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Todo item not found" });
  }
  res.status(200).json({ message: "Todo deleted", todo: deleted });
};
