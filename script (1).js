document.addEventListener("DOMContentLoaded", () => {
  // عناصر الصفحة
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const errorMsg = document.getElementById("errorMsg");
const listContainer = document.getElementById("listContainer");

  const filterAll = document.getElementById("filterAll");
  const filterDone = document.getElementById("filterDone");
  const filterTodo = document.getElementById("filterTodo");

  
  const deleteDoneBtn = document.getElementById("deleteDone");
  const deleteAllBtn = document.getElementById("deleteAll");

  const deleteModal = document.getElementById("deleteModal");
  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");
  const deleteDoneModal = document.getElementById("deleteDoneModal");
  const confirmDeleteDone = document.getElementById("confirmDeleteDone");
  const cancelDeleteDone = document.getElementById("cancelDeleteDone");

  const deleteAllModal = document.getElementById("deleteAllModal");
  const confirmDeleteAll = document.getElementById("confirmDeleteAll");
  const cancelDeleteAll = document.getElementById("cancelDeleteAll");

  const editModal = document.getElementById("editModal");
  const editInput = document.getElementById("editInput");
  const saveEdit = document.getElementById("saveEdit");
  const cancelEdit = document.getElementById("cancelEdit");
// حالة التطبيق
  const STORAGE_KEY = "todo_tasks_v1";
  let tasks = loadTasks();
  let currentFilter = "all"; // all | done | todo

  let taskToDeleteId = null;
  let taskToEditId = null;

  // Helpers
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }


  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
  }

  function hideError() {
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
  }

 function openModal(modalEl) {
    modalEl.classList.remove("hidden");
  }

  function closeModal(modalEl) {
    modalEl.classList.add("hidden");
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

// 1) not empty
  // 2) at least 5 characters
  // 3) cannot start with a number
  function validateTaskTitle(text) {
    if (text.trim() === "") return "Task cannot be empty";
    if (text.trim().length < 5) return "Task must be at least 5 characters";
    if (/^\d/.test(text.trim())) return "Task cannot start with a number";
    return null; // valid
  }

  function getFilteredTasks() {
    if (currentFilter === "done") return tasks.filter(t => t.done);
    if (currentFilter === "todo") return tasks.filter(t => !t.done);
    return tasks;
  }

// ===== Render =====
  function renderTasks() {
    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
      listContainer.innerHTML = `<p class="no-tasks">No tasks.</p>`;
      return;
    }

    listContainer.innerHTML = filtered.map(task => {
      const checked = task.done ? "checked" : "";
      const doneClass = task.done ? "done" : "";





