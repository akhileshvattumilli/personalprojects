const STORAGE_KEY = "todo-app-tasks";

const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");

let tasks = loadTasks();

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(text) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false
  };
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.className = `task-item${task.completed ? " completed" : ""}`;

    const taskMain = document.createElement("div");
    taskMain.className = "task-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-toggle";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" as complete`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskMain.append(checkbox, text);
    listItem.append(taskMain, deleteButton);
    taskList.appendChild(listItem);
  });

  const remainingCount = tasks.filter((task) => !task.completed).length;
  const itemLabel = tasks.length === 1 ? "item" : "items";
  taskCount.textContent = `${remainingCount} left • ${tasks.length} ${itemLabel}`;
}

function addTask(taskText) {
  const trimmedText = taskText.trim();

  if (!trimmedText) {
    return;
  }

  tasks.unshift(createTask(trimmedText));
  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});

renderTasks();