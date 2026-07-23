const API_BASE = "http://localhost:3000/api/todo";

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${response.status}`);
  }
  return response.json();
}

export async function getTasks() {
  const response = await fetch(API_BASE);
  return handleResponse(response);
}

export async function getTaskById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  return handleResponse(response);
}

export async function createTask(title, deadline, isUrgent) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, deadline, isUrgent }),
  });
  return handleResponse(response);
}

export async function updateTask(id, task) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(response);
}

export async function deleteTask(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}
