import { Todo } from "../models/Todo.js";

export async function getTasks(req, res) {
  const tasks = await Todo.findAll({ where: { userId: req.userId } });
  res.json(tasks);
}

export async function getTaskById(req, res) {
  const task = await Todo.findByPk(req.params.id);

  if (!task || task.userId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
}

export async function createTask(req, res) {
  const { title, deadline, isUrgent } = req.body;
  const task = await Todo.create({
    title,
    deadline,
    isUrgent,
    userId: req.userId,
  });
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const task = await Todo.findByPk(req.params.id);

  if (!task || task.userId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }

  await task.update(req.body);
  res.json(task);
}

export async function deleteTask(req, res) {
  const task = await Todo.findByPk(req.params.id);

  if (!task || task.userId !== req.userId) {
    return res.status(404).json({ error: "Task not found" });
  }

  await task.destroy();
  res.status(204).send();
}
