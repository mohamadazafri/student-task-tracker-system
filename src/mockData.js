// Mock data initialization for the Student Task Tracker
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const mockTasks = [
  // Completed tasks
  {
    id: "T1",
    title: "Mathematics Assignment",
    description: "Complete calculus homework from Chapter 5",
    dueDate: lastWeek.toISOString().split("T")[0],
    status: "Completed",
  },
  {
    id: "T2",
    title: "Physics Lab Report",
    description: "Write up the results from the pendulum experiment",
    dueDate: yesterday.toISOString().split("T")[0],
    status: "Completed",
  },

  // Overdue tasks
  {
    id: "T3",
    title: "History Essay",
    description: "Write 2000 words on World War II impact",
    dueDate: lastWeek.toISOString().split("T")[0],
    status: "Pending",
  },
  {
    id: "T4",
    title: "Chemistry Quiz Preparation",
    description: "Study organic chemistry reactions",
    dueDate: yesterday.toISOString().split("T")[0],
    status: "In Progress",
  },

  // Upcoming tasks (due within 7 days)
  {
    id: "T5",
    title: "Literature Review",
    description: "Read and analyze 'To Kill a Mockingbird'",
    dueDate: tomorrow.toISOString().split("T")[0],
    status: "In Progress",
  },
  {
    id: "T6",
    title: "Programming Project",
    description: "Complete the student management system",
    dueDate: today.toISOString().split("T")[0],
    status: "Pending",
  },
  {
    id: "T7",
    title: "Biology Research Paper",
    description: "Research on genetic modifications",
    dueDate: nextWeek.toISOString().split("T")[0],
    status: "In Progress",
  },

  // Future tasks
  {
    id: "T8",
    title: "Geography Presentation",
    description: "Prepare slides on climate change",
    dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "Pending",
  },
  {
    id: "T9",
    title: "Art Project",
    description: "Create a portfolio of drawings",
    dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "Not Started",
  },
  {
    id: "T10",
    title: "Music Recital",
    description: "Practice piano piece for performance",
    dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "In Progress",
  },
];

// Initialize localStorage with mock data if it's empty
export function initializeMockData() {
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(mockTasks));
  }
}

export function resetMockData() {
  localStorage.setItem("tasks", JSON.stringify(mockTasks));
}
