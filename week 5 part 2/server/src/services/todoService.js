import { TodoItem } from "../models/todoModel.js";

export const TodoService = {
  getAllTodos: () => TodoItem.findAll(),

  getTodoById: (id) => TodoItem.findByPk(id),

  createTodo: (data) =>
    TodoItem.create({
      title: data.title,
      deadline: data.deadline,
      isUrgent: data.isUrgent,
    }),

  updateTodo: async (id, data) => {
    const todo = await TodoItem.findByPk(id);
    if (!todo) return null;

    if (data.title !== undefined) todo.title = data.title;
    if (data.deadline !== undefined) todo.deadline = data.deadline;
    if (data.isUrgent !== undefined) todo.isUrgent = data.isUrgent;

    await todo.save();
    return todo;
  },

  deleteTodo: async (id) => {
    const todo = await TodoItem.findByPk(id);
    if (!todo) return null;

    await todo.destroy();
    return todo;
  },
};
