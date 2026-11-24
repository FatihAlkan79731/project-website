// js/utils.js
// Small helper functions for the Student Task Manager.

function formatTaskTitle(title) {
  if (typeof title !== "string") {
    return null; // not text at all -> invalid
  }
  const trimmed = title.trim(); // removes spaces at start and end
  if (trimmed.length === 0) {
    return null; // empty or only spaces -> invalid
  }
  return trimmed;
}

// Make the function available in the browser page:
if (typeof window !== "undefined") {
  window.formatTaskTitle = formatTaskTitle;
}

// Make it available for Node tests too (we need this in Task 3):
if (typeof module !== "undefined") {
  module.exports = { formatTaskTitle };
}
