const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("error");
const titleError = document.getElementById("titleError");
const dueDateError = document.getElementById("dueDateError");
const successMessage = document.getElementById("success");

let successTimer = null;

// Load saved tasks when the page opens
const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Today's date as "YYYY-MM-DD" in the user's own time zone
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No tasks yet.";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach(function (task) {
    const item = document.createElement("li");

    const title = document.createElement("strong");
    title.textContent = task.title;

    const details = document.createElement("span");
    details.textContent =
      "Due: " + (task.dueDate || "no date") +
      " · Priority: " + task.priority +
      " · Category: " + (task.category || "Other");

    item.appendChild(title);
    item.appendChild(details);
    taskList.appendChild(item);
  });
}

function clearMessages() {
  titleError.textContent = "";
  dueDateError.textContent = "";
  errorMessage.textContent = "";
}

function showSuccess() {
  successMessage.textContent = "Task added";
  clearTimeout(successTimer);
  successTimer = setTimeout(function () {
    successMessage.textContent = "";
  }, 3000);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearMessages();
  successMessage.textContent = "";

  // Remove extra spaces at the start and end of the title
  const title = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const category = document.getElementById("category").value;

  let valid = true;

  if (title === "") {
    titleError.textContent = "Please enter a task title.";
    valid = false;
  } else if (title.length > 60) {
    titleError.textContent = "Title is too long (max 60 characters).";
    valid = false;
  }

  if (dueDate === "") {
    dueDateError.textContent = "Please choose a due date.";
    valid = false;
  } else if (dueDate < getToday()) {
    dueDateError.textContent = "The due date cannot be in the past.";
    valid = false;
  }

  if (!valid) {
    errorMessage.textContent = "The task was not added. Please fix the errors above.";
    return;
  }

  tasks.push({ title: title, dueDate: dueDate, priority: priority, category: category });
  saveTasks();
  renderTasks();
  form.reset();
  showSuccess();
});

renderTasks();
