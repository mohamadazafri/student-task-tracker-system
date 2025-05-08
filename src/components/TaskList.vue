<template>
  <div class="task-list">
    <div class="task-list-header">
      <h2>Task List</h2>
      <b-button
        variant="primary"
        class="add-task-btn"
        @click="$emit('add-task')"
      >
        <i class="fas fa-plus"></i> Add New Task
      </b-button>
    </div>
    <div class="filter-section">
      <div class="filter-buttons">
        <b-button-group class="filter-button-group">
          <b-button
            :variant="selectedFilter === 'all' ? 'primary' : 'outline-primary'"
            @click="setFilter('all')"
            class="filter-btn"
          >
            <i class="fas fa-list"></i> All
          </b-button>
          <b-button
            :variant="
              selectedFilter === 'upcoming' ? 'primary' : 'outline-primary'
            "
            @click="setFilter('upcoming')"
            class="filter-btn"
          >
            <i class="fas fa-calendar-alt"></i> Upcoming
          </b-button>
          <b-button
            :variant="
              selectedFilter === 'overdue' ? 'danger' : 'outline-danger'
            "
            @click="setFilter('overdue')"
            class="filter-btn"
          >
            <i class="fas fa-exclamation-circle"></i> Overdue
          </b-button>
          <b-button
            :variant="
              selectedFilter === 'Pending' ? 'warning' : 'outline-warning'
            "
            @click="setFilter('Pending')"
            class="filter-btn"
          >
            <i class="fas fa-clock"></i> Pending
          </b-button>
          <b-button
            :variant="
              selectedFilter === 'In Progress' ? 'info' : 'outline-info'
            "
            @click="setFilter('In Progress')"
            class="filter-btn"
          >
            <i class="fas fa-spinner"></i> In Progress
          </b-button>
          <b-button
            :variant="
              selectedFilter === 'Completed' ? 'success' : 'outline-success'
            "
            @click="setFilter('Completed')"
            class="filter-btn"
          >
            <i class="fas fa-check-circle"></i> Completed
          </b-button>
        </b-button-group>
      </div>
    </div>

    <div class="table-container">
      <b-table
        :items="filteredTasks"
        :fields="fields"
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        striped
        hover
        responsive
        class="custom-table"
      >
        <template #cell(title)="data">
          <div class="task-title">{{ data.value }}</div>
        </template>

        <template #cell(description)="data">
          <div class="task-description">{{ data.value }}</div>
        </template>

        <template #cell(dueDate)="data">
          <div class="date-container">
            <span class="date">{{ formatDate(data.value) }}</span>
            <span
              v-if="!isCompleted(data.item)"
              :class="['remaining-days', getRemainingDaysClass(data.value)]"
            >
              {{ getRemainingDays(data.value) }}
            </span>
          </div>
        </template>

        <template #cell(status)="data">
          <b-badge :variant="getStatusVariant(data.value)" class="status-badge">
            {{ data.value }}
          </b-badge>
        </template>

        <template #cell(actions)="data">
          <div class="action-buttons">
            <b-button
              variant="primary"
              size="sm"
              @click="editTask(data.item)"
              class="edit-btn"
            >
              <i class="fas fa-edit"></i> Edit
            </b-button>
            <b-button
              variant="danger"
              size="sm"
              @click="deleteTask(data.item.id)"
              class="delete-btn"
            >
              <i class="fas fa-trash"></i> Delete
            </b-button>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskList",
  data() {
    return {
      fields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
          tdClass: "id-column",
          thClass: "id-column",
        },
        {
          key: "title",
          label: "Title",
          sortable: true,
          tdClass: "title-column",
          thClass: "title-column",
        },
        {
          key: "description",
          label: "Description",
          tdClass: "description-column",
          thClass: "description-column",
        },
        {
          key: "dueDate",
          label: "Due Date",
          sortable: true,
          sortByFormatted: true,
          formatter: (value) => new Date(value).getTime(),
          tdClass: "date-column",
          thClass: "date-column",
        },
        {
          key: "status",
          label: "Status",
          sortable: true,
          tdClass: "status-column",
          thClass: "status-column",
        },
        {
          key: "actions",
          label: "Actions",
          tdClass: "actions-column",
          thClass: "actions-column",
        },
      ],
      tasks: [],
      sortBy: "dueDate",
      sortDesc: true,
      selectedFilter: "all",
    };
  },
  computed: {
    filteredTasks() {
      if (this.selectedFilter === "all") {
        return this.tasks;
      }

      if (this.selectedFilter === "upcoming") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.tasks
          .filter((task) => {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil(
              (dueDate - today) / (1000 * 60 * 60 * 24)
            );
            // Show tasks that:
            // 1. Are not completed AND
            // 2. Due within next 7 days (0-7 days) but not overdue
            return (
              task.status !== "Completed" && diffDays >= 0 && diffDays <= 7
            );
          })
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date
      }

      if (this.selectedFilter === "overdue") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.tasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return (
            task.status !== "Completed" &&
            Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)) < 0
          );
        });
      }

      return this.tasks.filter((task) => task.status === this.selectedFilter);
    },
  },
  methods: {
    getStatusVariant(status) {
      const variants = {
        Pending: "warning",
        "In Progress": "info",
        Completed: "success",
      };
      return variants[status] || "secondary";
    },
    getRemainingDaysClass(date) {
      const dueDate = new Date(date);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "overdue";
      if (diffDays <= 2) return "urgent";
      return "normal";
    },
    getRemainingDays(date) {
      const dueDate = new Date(date);
      const today = new Date();

      // Set both dates to midnight for accurate day calculation
      dueDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      // Calculate the difference in milliseconds and convert to days
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Due today";
      if (diffDays === 1) return "Due tomorrow";
      if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
      return `${diffDays} days left`;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    editTask(task) {
      this.$emit("edit-task", task);
    },
    deleteTask(id) {
      if (confirm("Are you sure you want to delete this task?")) {
        const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        const updatedTasks = tasks.filter((task) => task.id !== id);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        window.dispatchEvent(new CustomEvent("taskUpdated"));
        this.loadTasks();
      }
    },
    loadTasks() {
      this.tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    },
    isCompleted(task) {
      return task.status === "Completed";
    },
    setFilter(filter) {
      this.selectedFilter = filter;
    },
  },
  mounted() {
    this.loadTasks();
    window.addEventListener("storage", this.loadTasks);
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.loadTasks);
  },
};
</script>

<style scoped>
.task-list {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 64px);
}

.task-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0;
}

.task-list-header h2 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
  font-size: 2rem;
  line-height: 1;
}

.add-task-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 1rem;
  height: 38px;
  background: #0d6efd;
  border-color: #0d6efd;
  transition: all 0.2s ease;
}

.add-task-btn:hover {
  background: #0b5ed7;
  border-color: #0b5ed7;
  transform: translateY(-1px);
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-buttons {
  width: 100%;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-button-group {
  display: flex;
  width: 100%;
  gap: 0.75rem;
  justify-content: center;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-btn i {
  font-size: 0.875rem;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.custom-table {
  margin-bottom: 0;
  width: 100%;
  table-layout: fixed;
}

/* Column width definitions using percentages */
.id-column {
  width: 8%;
}

.title-column {
  width: 17%;
}

.description-column {
  width: 30%;
}

.date-column {
  width: 20%;
}

.status-column {
  width: 12%;
}

.actions-column {
  width: 13%;
}

.custom-table >>> thead th {
  background-color: #e9ecef;
  border-bottom: 2px solid #dee2e6;
  color: #2c3e50;
  font-weight: 600;
  padding: 1rem;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-table >>> tbody td {
  padding: 1rem;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-title {
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.task-description {
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.date-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date {
  color: #2c3e50;
}

.remaining-days {
  font-size: 0.85rem;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.remaining-days.urgent {
  background-color: #fde8ea;
  color: #dc3545;
}

.remaining-days.normal {
  background-color: #e9ecef;
  color: #6c757d;
}

.status-badge {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

/* Ensure buttons don't shrink */
.edit-btn,
.delete-btn {
  flex-shrink: 0;
}

/* Add hover effect to rows */
.custom-table >>> tbody tr:hover {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .task-list {
    padding: 1rem;
  }

  .task-list-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .add-task-btn {
    width: 100%;
  }

  .task-description {
    max-width: 200px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .edit-btn,
  .delete-btn {
    width: 100%;
  }
}
</style>
