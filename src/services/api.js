import axios from "axios";

// const API_URL = "http://localhost/student-task-tracker-system/api/tasks.php";
// const API_URL = "https://student-task-tracker-system.kesug.com/index.php";
const API_URL = "https://utm-web-tech.as.r.appspot.com/index.php";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const taskService = {
  // Get all tasks
  getAllTasks() {
    return api.get("/tasks");
  },

  // Get a single task
  getTask(id) {
    return api.get(`/tasks/${id}`);
  },

  // Create a new task
  createTask(task) {
    return api.post("/tasks", task);
  },

  // Update a task
  updateTask(id, task) {
    return api.put(`/tasks/${id}`, task);
  },

  // Delete a task
  deleteTask(id) {
    return api.delete(`/tasks/${id}`);
  },
};
