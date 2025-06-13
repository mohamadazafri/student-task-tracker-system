<template>
  <div class="task-form-container">
    <div class="task-form">
      <h2 class="form-title">
        <i class="fas" :class="isEditing ? 'fa-edit' : 'fa-plus-circle'"></i>
        {{ isEditing ? "Edit Task" : "Add New Task" }}
      </h2>

      <b-form @submit.prevent="handleSubmit">
        <b-form-group label="Title" label-for="title" class="form-group">
          <b-form-input
            id="title"
            v-model="form.title"
            required
            placeholder="Enter task title"
            class="form-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Description"
          label-for="description"
          class="form-group"
        >
          <b-form-textarea
            id="description"
            v-model="form.description"
            required
            placeholder="Enter task description"
            rows="3"
            class="form-input"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group label="Due Date" label-for="dueDate" class="form-group">
          <b-form-input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            required
            class="form-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Status" label-for="status" class="form-group">
          <b-form-select
            id="status"
            v-model="form.status"
            :options="statusOptions"
            required
            class="form-input"
          ></b-form-select>
        </b-form-group>

        <div class="form-actions">
          <b-button
            type="submit"
            variant="primary"
            class="submit-btn"
            :disabled="loading"
          >
            <i class="fas" :class="isEditing ? 'fa-save' : 'fa-plus'"></i>
            {{ isEditing ? "Update Task" : "Add Task" }}
          </b-button>
          <b-button
            variant="outline-secondary"
            @click="handleCancel"
            class="cancel-btn"
            :disabled="loading"
          >
            <i class="fas fa-times"></i> Cancel
          </b-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<style scoped>
.task-form-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
}

.task-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  color: #2c3e50;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-title i {
  color: #0d6efd;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-input {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.625rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.submit-btn {
  background: #0d6efd;
  border-color: #0d6efd;
}

.submit-btn:hover {
  background: #0b5ed7;
  border-color: #0b5ed7;
  transform: translateY(-1px);
}

.cancel-btn {
  color: #6c757d;
  border-color: #6c757d;
}

.cancel-btn:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  transform: translateY(-1px);
}

/* Status select styling */
.form-input.custom-select {
  background-color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .task-form-container {
    padding: 1rem;
  }

  .task-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

<script>
import { taskService } from "../services/api";

export default {
  name: "TaskForm",
  props: {
    task: {
      type: Object,
      default: null,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        id: "",
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
      },
      statusOptions: ["Pending", "In Progress", "Completed"],
      loading: false,
      error: null,
    };
  },
  computed: {
    isEditing() {
      return !!this.form.id;
    },
    formTitle() {
      return this.isEditing ? "Edit Task" : "Add New Task";
    },
  },
  watch: {
    task: {
      handler(newTask) {
        if (newTask) {
          this.form = { ...newTask };
        } else {
          this.resetForm();
        }
      },
      immediate: true,
    },
    show: {
      handler(newVal) {
        if (!newVal) {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    resetForm() {
      this.form = {
        id: "",
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
      };
      this.error = null;
    },
    async handleSubmit() {
      this.loading = true;
      this.error = null;
      try {
        if (this.isEditing) {
          await taskService.updateTask(this.form.id, this.form);
        } else {
          await taskService.createTask(this.form);
        }
        this.$emit("task-saved");
        this.resetForm();
      } catch (error) {
        this.error = this.isEditing
          ? "Failed to update task. Please try again later."
          : "Failed to create task. Please try again later.";
        console.error("Error saving task:", error);
      } finally {
        this.loading = false;
      }
    },
    handleCancel() {
      this.$emit("cancel");
      this.resetForm();
    },
    getMinDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
  },
};
</script>
