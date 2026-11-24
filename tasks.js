// This file is loaded with <script type="module"> (see tasks.html),
// so "const supabase" below does not clash with the library's global "supabase".

// Use the URL and key your teacher gave you
const SUPABASE_URL = "https://xxxxx.supabase.co"; // <-- your project URL
const SUPABASE_KEY = "eyJhbGciOi...";             // <-- your anon key

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const authForm = document.getElementById("authForm");
const authError = document.getElementById("authError");
const authInfo = document.getElementById("authInfo");
const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("error");
const titleError = document.getElementById("titleError");
const successMessage = document.getElementById("success");
const onlyNotDoneCheckbox = document.getElementById("onlyNotDone");

let successTimer = null;

// ---------- Helpers ----------

function isConfigured() {
  return !SUPABASE_URL.includes("xxxxx") && !SUPABASE_KEY.endsWith("...");
}

function showSuccess(text) {
  successMessage.textContent = text;
  clearTimeout(successTimer);
  successTimer = setTimeout(function () {
    successMessage.textContent = "";
  }, 3000);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = onlyNotDoneCheckbox.checked ? "No not-done tasks. Well done!" : "No tasks yet.";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach(function (task) {
    const item = document.createElement("li");
    item.className = "task-row" + (task.done ? " done" : "");

    // Checkbox for "done" (UPDATE)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.title = "Mark as done";
    checkbox.addEventListener("change", function () {
      toggleDone(task.id, checkbox.checked);
    });

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    // Small label with the priority (old tasks get "normal" from the DEFAULT)
    const priority = task.priority || "normal";
    const label = document.createElement("span");
    label.className = "priority-label priority-" + priority;
    label.textContent = priority;

    // Delete button (DELETE)
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    item.appendChild(checkbox);
    item.appendChild(title);
    item.appendChild(label);
    item.appendChild(deleteButton);
    taskList.appendChild(item);
  });
}

// ---------- CRUD ----------

// Read — show the tasks (SELECT)
// onlyNotDone = true  -> only rows WHERE done = false
// onlyNotDone = false -> all rows
async function loadTasks(onlyNotDone = onlyNotDoneCheckbox.checked) {
  let query = supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (onlyNotDone) {
    query = query.eq("done", false); // like SQL: WHERE done = false
  }

  const { data, error } = await query;

  if (error) { alert("Could not load tasks: " + error.message); return; }
  renderTasks(data);
}

// Create — add a task (INSERT)
async function addTask(title, chosenPriority) {
  const { error } = await supabase
    .from("tasks")
    .insert({ title: title, priority: chosenPriority }); // user_id is filled in by the server for a logged-in user

  if (error) { alert("Could not add task: " + error.message); return; }
  showSuccess("Task added");
  loadTasks();
}

// Update — toggle "done" (UPDATE)
async function toggleDone(id, newValue) {
  const { error } = await supabase
    .from("tasks")
    .update({ done: newValue })
    .eq("id", id); // WHERE id = ...

  if (error) { alert("Could not update task: " + error.message); return; }
  loadTasks();
}

// Delete — remove a task (DELETE)
async function deleteTask(id) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id); // WHERE id = ...

  if (error) { alert("Could not delete task: " + error.message); return; }
  loadTasks();
}

// ---------- Form ----------

form.addEventListener("submit", function (event) {
  event.preventDefault();
  titleError.textContent = "";
  errorMessage.textContent = "";

  const title = document.getElementById("title").value.trim();

  if (title === "") {
    titleError.textContent = "Please enter a task title.";
    errorMessage.textContent = "The task was not added. Please fix the errors above.";
    return;
  }

  if (title.length > 60) {
    titleError.textContent = "Title is too long (max 60 characters).";
    errorMessage.textContent = "The task was not added. Please fix the errors above.";
    return;
  }

  const chosenPriority = document.getElementById("priority").value; // low, normal or high
  addTask(title, chosenPriority);
  form.reset();
});

// ---------- Filter ----------

// Checked: only not-done tasks. Empty: all tasks again.
onlyNotDoneCheckbox.addEventListener("change", function () {
  loadTasks(onlyNotDoneCheckbox.checked);
});

// ---------- Login (Supabase Auth) ----------

function readCredentials() {
  authError.textContent = "";
  authInfo.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (email === "" || password === "") {
    authError.textContent = "Please enter your email and password.";
    return null;
  }
  return { email: email, password: password };
}

authForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const credentials = readCredentials();
  if (!credentials) return;

  const { error } = await supabase.auth.signInWithPassword(credentials);
  if (error) { authError.textContent = "Could not log in: " + error.message; }
});

document.getElementById("signupButton").addEventListener("click", async function () {
  const credentials = readCredentials();
  if (!credentials) return;

  const { data, error } = await supabase.auth.signUp(credentials);
  if (error) { authError.textContent = "Could not create account: " + error.message; return; }
  if (!data.session) {
    authInfo.textContent = "Account created. Check your email to confirm it, then log in.";
  }
});

document.getElementById("logoutButton").addEventListener("click", function () {
  supabase.auth.signOut();
});

// Show the login form or the task list, depending on the session
function showScreen(session) {
  if (session) {
    authSection.hidden = true;
    appSection.hidden = false;
    document.getElementById("userEmail").textContent = session.user.email;
    loadTasks();
  } else {
    appSection.hidden = true;
    authSection.hidden = false;
    taskList.innerHTML = "";
  }
}

if (isConfigured()) {
  supabase.auth.onAuthStateChange(function (_event, session) {
    showScreen(session);
  });
} else {
  const warning = document.getElementById("configWarning");
  warning.textContent = "Supabase is not configured yet: put the class project URL and anon key at the top of tasks.js.";
  warning.hidden = false;
}
