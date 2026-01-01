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

 return `
        <div class="task-row ${doneClass}" data-id="${task.id}">
          <span class="task-title">${escapeHtml(task.title)}</span>

          <div class="task-actions">
            <input class="done-checkbox" type="checkbox" ${checked} />
            <button class="icon-btn edit-btn" title="Edit">✏️</button>
            <button class="icon-btn delete-btn" title="Delete">🗑️</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // ===== Events =====
// اخفي الخطأ أول ما المستخدم يبلّش يكتب شي صح
  taskInput.addEventListener("input", () => {
    const msg = validateTaskTitle(taskInput.value);
    if (msg === null) hideError();
  });

  // إضافة مهمة
  addBtn.addEventListener("click", () => {
    const text = taskInput.value;

    const msg = validateTaskTitle(text);
    if (msg) {
      showError(msg);
      return;
    }
 tasks.push({
      id: Date.now(),
      title: text.trim(),
      done: false
    });

    saveTasks();
    taskInput.value = "";
    hideError();       //  م عشان ما تضل الرسالة ظاهر
    renderTasks();
  });

  // Enter adds task
  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });

  // Delegation: edit/delete by click
  listContainer.addEventListener("click", (e) => {
    const row = e.target.closest(".task-row");
    if (!row) return;
 const id = Number(row.dataset.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Delete one
    if (e.target.classList.contains("delete-btn")) {
      taskToDeleteId = id;
      openModal(deleteModal);
      return;
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {
      taskToEditId = id;
      editInput.value = task.title;
      openModal(editModal);
      return;
    }
  });

  // checkbox change

  listContainer.addEventListener("change", (e) => {
    const row = e.target.closest(".task-row");
    if (!row) return;

    const id = Number(row.dataset.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (e.target.classList.contains("done-checkbox")) {
      task.done = e.target.checked;
      saveTasks();
      renderTasks();
    }
  });
// Filters + active class
  function setActiveFilter(btn) {
    [filterAll, filterDone, filterTodo].forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  filterAll.addEventListener("click", () => {
    currentFilter = "all";
    setActiveFilter(filterAll);
    renderTasks();
  });

  filterDone.addEventListener("click", () => {
    currentFilter = "done";
    setActiveFilter(filterDone);
    renderTasks();
  });

  filterTodo.addEventListener("click", () => {
    currentFilter = "todo";
    setActiveFilter(filterTodo);
    renderTasks();
  });

   // ===== Edit modal =====
  saveEdit.addEventListener("click", () => {
    const msg = validateTaskTitle(editInput.value);
    if (msg) {
      alert(msg);
      return;
    }

     const t = tasks.find(x => x.id === taskToEditId);
    if (t) t.title = editInput.value.trim();

    saveTasks();
    renderTasks();
    taskToEditId = null;
    closeModal(editModal);
  });
