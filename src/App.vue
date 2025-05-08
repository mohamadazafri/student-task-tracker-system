<template>
  <div id="app">
    <nav class="custom-navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">Student Task Tracker</router-link>
        <div class="nav-links">
          <a
            href="#"
            :class="['nav-link', { active: currentView === 'dashboard' }]"
            @click="currentView = 'dashboard'"
          >
            Dashboard
          </a>
          <a
            href="#"
            :class="['nav-link', { active: currentView === 'tasks' }]"
            @click="currentView = 'tasks'"
          >
            Tasks
          </a>
        </div>
      </div>
    </nav>

    <div class="main-container">
      <component
        :is="currentComponent"
        :task="selectedTask"
        @edit-task="handleEditTask"
        @task-saved="handleTaskSaved"
        @cancel="currentView = 'tasks'"
        @add-task="handleAddTask"
      />
    </div>
  </div>
</template>

<script>
import TaskDashboard from "./components/Dashboard.vue";
import TaskList from "./components/TaskList.vue";
import TaskForm from "./components/TaskForm.vue";

export default {
  name: "App",
  components: {
    TaskDashboard,
    TaskList,
    TaskForm,
  },
  data() {
    return {
      currentView: "dashboard",
      selectedTask: null,
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentView) {
        case "dashboard":
          return "TaskDashboard";
        case "tasks":
          return "TaskList";
        case "add-task":
          return "TaskForm";
        case "edit-task":
          return "TaskForm";
        default:
          return "TaskDashboard";
      }
    },
  },
  methods: {
    handleEditTask(task) {
      this.selectedTask = task;
      this.currentView = "edit-task";
    },
    handleTaskSaved() {
      this.currentView = "tasks";
      this.selectedTask = null;
    },
    handleAddTask() {
      this.selectedTask = null;
      this.currentView = "add-task";
    },
  },
};
</script>

<style>
#app {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.custom-navbar {
  background: white;
  padding: 0.8rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.nav-brand {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-right: auto;
}

.nav-brand:hover {
  color: #3498db;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
  margin-left: auto;
  align-items: center;
}

.nav-link {
  color: #6c757d;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #3498db;
  text-decoration: none;
}

.nav-link.active {
  color: #3498db;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3498db;
}

.main-container {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  overflow: hidden;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
}
</style>
