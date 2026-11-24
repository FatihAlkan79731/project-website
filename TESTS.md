# Test table — `formatTaskTitle(title)`

Function: `formatTaskTitle(title)` in `js/utils.js` removes spaces at the start and at the end of a task title. If the result is empty (or the input is not text), it returns `null`, and the page shows the error "The task title cannot be empty."

Tests are in `js/utils.test.js`. Run them with `node js/utils.test.js`; GitHub Actions also runs them after every push (`.github/workflows/ci.yml`).

| # | Test name | Input | Steps | Expected result | Actual result | Pass? |
|---|---|---|---|---|---|---|
| 1 | trims spaces | `"  Buy milk  "` | call `formatTaskTitle` | `"Buy milk"` | `"Buy milk"` | ✅ |
| 2 | keeps normal text | `"Read a book"` | call `formatTaskTitle` | `"Read a book"` | `"Read a book"` | ✅ |
| 3 | empty string is rejected | `""` | call `formatTaskTitle` | `null` | `null` | ✅ |
| 4 | only spaces is rejected | `"   "` | call `formatTaskTitle` | `null` | `null` | ✅ |
| 5 | only tabs is rejected (my idea) | `"\t\t"` | call `formatTaskTitle` | `null` (a tab is also empty space) | `null` | ✅ |

Tests 1 and 2 are **positive tests** (valid input). Tests 3, 4 and 5 are **negative tests** (invalid input).

**Bug on purpose:** when I changed the expected value of test 1 to `"Buy  milk"` (two spaces), the run showed `not ok 1 - trims spaces from the title` and `fail 1`. After changing it back, all tests passed again.
