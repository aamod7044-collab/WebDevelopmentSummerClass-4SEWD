import { apiRequest } from "../api";

export async function getTasks(token) {
  return apiRequest("/todo", { token });
}

export async function getTaskById(id, token) {
  return apiRequest(`/todo/${id}`, { token });
}

export async function updateTask(id, task, token) {
  return apiRequest(`/todo/${id}`, {
    method: "PUT",
    body: task,
    token,
  });
}

export async function createTask(title, deadline, isUrgent, token) {
  return apiRequest("/todo", {
    method: "POST",
    body: { title, deadline, isUrgent },
    token,
  });
}

export async function deleteTask(id, token) {
  return apiRequest(`/todo/${id}`, { method: "DELETE", token });
}
