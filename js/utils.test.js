// js/utils.test.js
// Run with:  node js/utils.test.js
const { test } = require("node:test");
const assert = require("node:assert");
const { formatTaskTitle } = require("./utils.js");

test("trims spaces from the title", () => {
  const result = formatTaskTitle("  Buy milk  ");
  assert.equal(result, "Buy milk"); // assertion 1
});

test("keeps normal text unchanged", () => {
  const result = formatTaskTitle("Read a book");
  assert.equal(result, "Read a book"); // assertion 2
});

test("rejects an empty title (negative test)", () => {
  const result = formatTaskTitle("");
  assert.equal(result, null); // assertion 3
});

test("rejects a title with only spaces (negative test)", () => {
  const result = formatTaskTitle("   ");
  assert.equal(result, null); // assertion 4
});

test("rejects a title with only tabs (negative test)", () => {
  const result = formatTaskTitle("\t\t");
  assert.equal(result, null); // assertion 5
});
