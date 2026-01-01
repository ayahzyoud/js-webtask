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