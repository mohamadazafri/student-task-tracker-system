<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2 class="dashboard-title">Dashboard</h2>
      <div class="quick-actions">
        <b-button
          variant="primary"
          @click="$emit('add-task')"
          class="action-btn"
        >
          <i class="fas fa-plus"></i> Add New Task
        </b-button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <b-row class="stats-row">
      <b-col md="3">
        <div class="stat-card primary">
          <div class="stat-content">
            <div class="stat-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <h3 class="stat-number">{{ totalTasks }}</h3>
            <p class="stat-label">Total Tasks</p>
          </div>
        </div>
      </b-col>
      <b-col md="3">
        <div class="stat-card success">
          <div class="stat-content">
            <div class="stat-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="stat-number">{{ completedTasks }}</h3>
            <p class="stat-label">Completed Tasks</p>
          </div>
        </div>
      </b-col>
      <b-col md="3">
        <div class="stat-card warning">
          <div class="stat-content">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <h3 class="stat-number">{{ pendingTasks }}</h3>
            <p class="stat-label">Pending Tasks</p>
          </div>
        </div>
      </b-col>
      <b-col md="3">
        <div class="stat-card info">
          <div class="stat-content">
            <div class="stat-icon">
              <i class="fas fa-spinner"></i>
            </div>
            <h3 class="stat-number">{{ inProgressTasks }}</h3>
            <p class="stat-label">In Progress</p>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- Charts and Stats Section -->
    <b-row class="content-row">
      <b-col lg="4">
        <div class="chart-card">
          <h3 class="chart-title">
            <i class="fas fa-chart-pie"></i>
            Tasks by Status
          </h3>
          <div class="chart-container">
            <PieChart :data="statusChartData" :options="pieChartOptions" />
          </div>
        </div>
      </b-col>

      <b-col lg="4">
        <div class="chart-card">
          <h3 class="chart-title">
            <i class="fas fa-chart-bar"></i>
            Tasks Due This Week
          </h3>
          <div class="chart-container">
            <BarChart :data="dueDateChartData" :options="barChartOptions" />
          </div>
        </div>
      </b-col>

      <b-col lg="4">
        <div class="info-card deadline-card">
          <h3 class="info-title">
            <i class="fas fa-calendar-alt"></i>
            <span>Upcoming Deadlines</span>
            <span class="subtitle">for the next 7 days</span>
          </h3>
          <div class="deadline-list">
            <div
              v-for="task in upcomingDeadlines"
              :key="task.id"
              class="deadline-item"
            >
              <div class="deadline-info">
                <span class="deadline-title">{{ task.title }}</span>
                <div class="deadline-details">
                  <span
                    :class="[
                      'deadline-date',
                      isUrgent(task.dueDate) ? 'urgent' : '',
                    ]"
                  >
                    {{ formatDate(task.dueDate) }}
                  </span>
                  <span
                    class="remaining-days"
                    :class="getRemainingDaysClass(task.dueDate)"
                  >
                    {{ getRemainingDays(task.dueDate) }}
                  </span>
                </div>
              </div>
              <b-badge :variant="getStatusVariant(task.status)">{{
                task.status
              }}</b-badge>
            </div>
            <div v-if="upcomingDeadlines.length === 0" class="no-deadlines">
              No upcoming deadlines
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// Import required chart components and utilities
import { Pie as PieChart, Bar as BarChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

export default {
  name: "TaskDashboard",
  components: {
    PieChart,
    BarChart,
  },
  inject: ["router"],
  data() {
    return {
      tasks: [], // Store all tasks
      // Configuration for pie chart
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
      // Configuration for bar chart
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };
  },
  computed: {
    // Calculate total number of tasks
    totalTasks() {
      return this.tasks.length;
    },
    // Count completed tasks
    completedTasks() {
      return this.tasks.filter((task) => task.status === "Completed").length;
    },
    // Count pending tasks
    pendingTasks() {
      return this.tasks.filter((task) => task.status === "Pending").length;
    },
    // Count in-progress tasks
    inProgressTasks() {
      return this.tasks.filter((task) => task.status === "In Progress").length;
    },
    // Calculate completion rate percentage
    completionRate() {
      return this.totalTasks
        ? Math.round((this.completedTasks / this.totalTasks) * 100)
        : 0;
    },
    // Get upcoming deadlines for next 7 days
    upcomingDeadlines() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.tasks
        .filter((task) => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
          // Show tasks that:
          // 1. Are not completed AND
          // 2. Due within next 7 days (0-7 days) including today AND
          // 3. Not overdue (diffDays >= 0)
          return task.status !== "Completed" && diffDays >= 0 && diffDays <= 7;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date
    },
    // Data for status distribution pie chart
    statusChartData() {
      return {
        labels: ["Pending", "In Progress", "Completed"],
        datasets: [
          {
            backgroundColor: ["#ffc107", "#17a2b8", "#28a745"],
            data: [
              this.tasks.filter((task) => task.status === "Pending").length,
              this.tasks.filter((task) => task.status === "In Progress").length,
              this.tasks.filter((task) => task.status === "Completed").length,
            ],
          },
        ],
      };
    },
    // Data for weekly task distribution bar chart
    dueDateChartData() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const days = [
        "Today",
        "Tomorrow",
        "Day 3",
        "Day 4",
        "Day 5",
        "Day 6",
        "Day 7",
      ];
      const counts = new Array(7).fill(0);

      // Count tasks due on each day of the week
      this.tasks.forEach((task) => {
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          const diffDays = Math.floor(
            (dueDate - today) / (1000 * 60 * 60 * 24)
          );
          if (diffDays >= 0 && diffDays < 7) {
            counts[diffDays]++;
          }
        }
      });

      return {
        labels: days,
        datasets: [
          {
            label: "Tasks Due",
            data: counts,
            backgroundColor: "#007bff",
            borderColor: "#0056b3",
            borderWidth: 1,
          },
        ],
      };
    },
  },
  methods: {
    // Load tasks from localStorage
    loadTasks() {
      const tasksData = localStorage.getItem("tasks");
      if (tasksData) {
        try {
          this.tasks = JSON.parse(tasksData);
        } catch (e) {
          console.error("Error parsing tasks:", e);
          this.tasks = [];
        }
      } else {
        this.tasks = [];
      }
    },
    // Set up event listeners for task updates
    setupEventListeners() {
      window.addEventListener("taskUpdated", this.loadTasks);
      window.addEventListener("storage", (e) => {
        if (e.key === "tasks") {
          this.loadTasks();
        }
      });
    },
    // Format date for display
    formatDate(date) {
      const options = { month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    // Check if a task is urgent (due within 2 days)
    isUrgent(date) {
      const dueDate = new Date(date);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 2;
    },
    // Get appropriate color variant for status badges
    getStatusVariant(status) {
      const variants = {
        Pending: "warning",
        "In Progress": "info",
        Completed: "success",
      };
      return variants[status] || "secondary";
    },
    // Get appropriate color variant for progress bars
    getProgressVariant(value) {
      if (value >= 75) return "success";
      if (value >= 50) return "info";
      if (value >= 25) return "warning";
      return "danger";
    },
    // Calculate and format remaining days until due date
    getRemainingDays(date) {
      const dueDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Due today";
      if (diffDays === 1) return "Due tomorrow";
      if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
      return `${diffDays} days left`;
    },
    // Get CSS class for remaining days display
    getRemainingDaysClass(date) {
      const dueDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "due-today";
      if (diffDays === 1) return "urgent";
      return "normal";
    },
  },
  // Lifecycle hooks
  created() {
    // Load tasks when component is created
    this.loadTasks();
  },
  mounted() {
    // Set up event listeners and start periodic refresh
    this.setupEventListeners();
    this.loadTasks();
    this.refreshInterval = setInterval(() => {
      this.loadTasks();
    }, 2000);
  },
  beforeUnmount() {
    // Clean up event listeners and intervals
    window.removeEventListener("taskUpdated", this.loadTasks);
    window.removeEventListener("storage", this.loadTasks);
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f8f9fa;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.stat-content {
  text-align: center;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.9);
}

.stat-number {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: white;
}

.stat-label {
  font-size: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.primary {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}
.success {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}
.warning {
  background: linear-gradient(135deg, #ffc107 0%, #ffa000 100%);
}
.info {
  background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
}

.content-row {
  flex-grow: 1;
  min-height: 0;
  margin: 0 -10px;
}

.content-row > [class*="col-"] {
  padding: 0 10px;
}

.chart-card,
.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-container {
  height: 300px;
}

.deadline-list {
  height: 300px;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 5px;
}

.deadline-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.deadline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.deadline-item:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.deadline-info {
  display: flex;
  flex-direction: column;
}

.deadline-title {
  font-weight: 500;
  color: #2c3e50;
}

.deadline-details {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
}

.deadline-date {
  font-size: 0.9rem;
  color: #6c757d;
}

.deadline-date.urgent {
  color: #dc3545;
  font-weight: 500;
}

.remaining-days {
  font-size: 0.85rem;
  padding: 2px 6px;
  border-radius: 4px;
  color: #6c757d;
  background-color: #e9ecef;
}

.remaining-days.due-today {
  color: #dc3545;
  background-color: #ffebee;
  font-weight: 500;
}

.remaining-days.urgent {
  color: #dc3545;
  background-color: #fde8ea;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-item {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.progress-item:hover {
  background-color: #e9ecef;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.custom-progress {
  border-radius: 8px;
  overflow: hidden;
}

.no-deadlines {
  text-align: center;
  color: #6c757d;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.deadline-card {
  height: 100%;
  margin-bottom: 0;
}

.chart-title,
.info-title {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1f1f1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-title .subtitle {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: normal;
}

.view-all-button {
  display: block;
  width: 100%;
  color: #007bff !important;
  text-decoration: none;
  padding: 8px;
  margin-top: 8px;
  font-weight: 500;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  transition: color 0.2s ease;
}

.view-all-button:hover {
  color: #0056b3 !important;
  text-decoration: underline;
}

.view-all-button:focus {
  box-shadow: none !important;
}

@media (max-width: 992px) {
  .chart-card,
  .info-card {
    margin-bottom: 20px;
    min-height: 400px;
  }

  .chart-container {
    height: 250px;
  }
}
</style>
