const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("error");

// Load saved tasks when the page opens
const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
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
    details.textContent = "Due: " + (task.dueDate || "no date") + " · Priority: " + task.priority;

    item.appendChild(title);
    item.appendChild(details);
    taskList.appendChild(item);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (title.trim() === "") {
    errorMessage.textContent = "Please enter a task title.";
    return;
  }

  if (title.trim().length > 60) {
    errorMessage.textContent = "Title is too long (max 60 characters).";
    return;
  }

  errorMessage.textContent = "";
  tasks.push({ title: title, dueDate: dueDate, priority: priority });
  saveTasks();
  renderTasks();
  form.reset();
});

renderTasks();
