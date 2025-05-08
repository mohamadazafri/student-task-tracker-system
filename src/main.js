import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import { BootstrapVue3 } from "bootstrap-vue-3";

// Initialize mock data if not exists
if (!localStorage.getItem("tasks")) {
  const mockTasks = [
    {
      id: "T1",
      title: "Complete Project Proposal",
      description:
        "Write and submit the project proposal for the final year project",
      dueDate: "2024-03-25",
      status: "Pending",
    },
    {
      id: "T2",
      title: "Study for Midterm Exam",
      description: "Review all course materials and practice problems",
      dueDate: "2024-03-20",
      status: "In Progress",
    },
    {
      id: "T3",
      title: "Group Meeting",
      description: "Weekly group meeting to discuss project progress",
      dueDate: "2024-03-18",
      status: "Completed",
    },
    {
      id: "T4",
      title: "Submit Assignment 3",
      description: "Complete and submit the third programming assignment",
      dueDate: "2024-03-22",
      status: "Pending",
    },
  ];
  localStorage.setItem("tasks", JSON.stringify(mockTasks));
}

const app = createApp(App);
app.use(BootstrapVue3);
app.mount("#app");
