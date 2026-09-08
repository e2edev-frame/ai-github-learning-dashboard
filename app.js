"use strict";
/* Tiny todo app. State lives in localStorage under KEY. No backend. */

const KEY = "todo-app:tasks.v1";

const listEl = document.getElementById("list");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("new-task");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear-completed");
const filterBtns = Array.from(document.querySelectorAll(".filters button"));

let filter = "all";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function visible(tasks) {
  if (filter === "active") return tasks.filter((t) => !t.done);
  if (filter === "completed") return tasks.filter((t) => t.done);
  return tasks;
}

function editTask(id, editInput) {
  const tasks = load();
  const current = tasks.find((t) => t.id === id);
  if (!current) return;

  const clean = editInput.value.trim().slice(0, 200);
  if (clean) {
    current.text = clean;
    save(tasks);
  }
  render();
}

function render() {
  const tasks = load();
  listEl.innerHTML = "";
  for (const task of visible(tasks)) {
    const li = document.createElement("li");
    if (task.done) li.className = "done";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = !!task.done;
    box.setAttribute("aria-label", "Toggle task");
    box.addEventListener("change", () => toggle(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("dblclick", () => {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = task.text;
      editInput.maxLength = 200;
      editInput.className = "edit-task";
      editInput.setAttribute("aria-label", "Edit task");
      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          editTask(task.id, editInput);
        } else if (e.key === "Escape") {
          render();
        }
      });
      span.replaceWith(editInput);
      editInput.focus();
      editInput.select();
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "del";
    del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", () => remove(task.id));

    li.append(box, span, del);
    listEl.appendChild(li);
  }
  const active = tasks.filter((t) => !t.done).length;
  countEl.textContent = active + " active";
}

function add(text) {
  const clean = text.trim().slice(0, 200);
  if (!clean) return;
  const tasks = load();
  tasks.push({ id: uid(), text: clean, done: false });
  save(tasks);
  render();
}

function toggle(id) {
  const tasks = load();
  const task = tasks.find((t) => t.id === id);
  if (task) task.done = !task.done;
  save(tasks);
  render();
}

function remove(id) {
  save(load().filter((t) => t.id !== id));
  render();
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  add(inputEl.value);
  inputEl.value = "";
  inputEl.focus();
});

clearBtn.addEventListener("click", () => {
  save(load().filter((t) => !t.done));
  render();
});

for (const btn of filterBtns) {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    for (const b of filterBtns) b.classList.toggle("active", b === btn);
    render();
  });
}

render();
