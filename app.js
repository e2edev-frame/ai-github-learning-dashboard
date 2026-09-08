"use strict";

const KEY = "ai-github-learning-dashboard:items.v1";
const LEGACY_KEY = "todo-app:tasks.v1";
const STATUS_LABELS = {
  "not-started": "ยังไม่เริ่ม",
  "in-progress": "กำลังเรียน",
  completed: "เรียนจบแล้ว",
};

const formEl = document.getElementById("item-form");
const idEl = document.getElementById("item-id");
const titleEl = document.getElementById("item-title");
const categoryEl = document.getElementById("item-category");
const statusEl = document.getElementById("item-status");
const notesEl = document.getElementById("item-notes");
const githubUrlEl = document.getElementById("item-github-url");
const cancelEditEl = document.getElementById("cancel-edit");
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty-state");
const countEl = document.getElementById("count");
const searchEl = document.getElementById("search-input");
const statusFilterEl = document.getElementById("status-filter");
const categoryFilterEl = document.getElementById("category-filter");

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function safeGithubUrl(value) {
  const url = String(value || "").trim().slice(0, 500);
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : "";
  } catch {
    return "";
  }
}

function normalize(item) {
  return {
    id: item.id || uid(),
    title: String(item.title || "").trim().slice(0, 200),
    category: String(item.category || "General").trim().slice(0, 80),
    status: STATUS_LABELS[item.status] ? item.status : "not-started",
    notes: String(item.notes || "").trim().slice(0, 1000),
    githubUrl: safeGithubUrl(item.githubUrl),
  };
}

function uniqueIds(items) {
  const ids = new Set();
  return items.map((item) => {
    if (ids.has(item.id)) item.id = uid();
    ids.add(item.id);
    return item;
  });
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const items = uniqueIds(parsed.map(normalize).filter((item) => item.title));
      save(items);
      return items;
    }
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
    if (!Array.isArray(legacy)) return [];
    const migrated = uniqueIds(legacy.map((task) => normalize({
      id: task.id,
      title: task.text,
      category: "General",
      status: task.done ? "completed" : "not-started",
    })).filter((item) => item.title));
    save(migrated);
    localStorage.removeItem(LEGACY_KEY);
    return migrated;
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

function filtered(items) {
  const query = searchEl.value.trim().toLowerCase();
  return items.filter((item) => {
    const matchesStatus = statusFilterEl.value === "all" || item.status === statusFilterEl.value;
    const matchesCategory = categoryFilterEl.value === "all" || item.category === categoryFilterEl.value;
    const searchable = `${item.title} ${item.category} ${item.notes}`.toLowerCase();
    return matchesStatus && matchesCategory && (!query || searchable.includes(query));
  });
}

function refreshCategoryFilter(items) {
  const current = categoryFilterEl.value;
  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  categoryFilterEl.innerHTML = '<option value="all">ทุกหมวดหมู่</option>';
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilterEl.append(option);
  }
  categoryFilterEl.value = categories.includes(current) ? current : "all";
}

function render() {
  const items = load();
  refreshCategoryFilter(items);
  const shown = filtered(items);
  listEl.innerHTML = "";
  emptyEl.hidden = shown.length !== 0;
  countEl.textContent = `${shown.length} จาก ${items.length} รายการ`;

  for (const item of shown) {
    const li = document.createElement("li");
    li.className = "item";
    const top = document.createElement("div");
    top.className = "item-top";
    const heading = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const category = document.createElement("p");
    category.className = "category";
    category.textContent = item.category;
    heading.append(title, category);

    const status = document.createElement("span");
    status.className = `status status-${item.status}`;
    status.textContent = STATUS_LABELS[item.status];
    top.append(heading, status);

    const notes = document.createElement("p");
    notes.className = "notes";
    notes.textContent = item.notes || "ยังไม่มี notes";
    const bottom = document.createElement("div");
    bottom.className = "item-bottom";
    if (item.githubUrl) {
      const link = document.createElement("a");
      link.className = "github-link";
      link.href = item.githubUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "เปิด GitHub link";
      bottom.append(link);
    } else {
      bottom.append(document.createElement("span"));
    }

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "แก้ไข";
    edit.addEventListener("click", () => startEdit(item));
    const nextStatus = document.createElement("button");
    nextStatus.type = "button";
    nextStatus.textContent = "เปลี่ยนสถานะ";
    nextStatus.addEventListener("click", () => cycleStatus(item.id));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "ลบ";
    remove.addEventListener("click", () => removeItem(item.id));
    actions.append(edit, nextStatus, remove);
    bottom.append(actions);
    li.append(top, notes, bottom);
    listEl.append(li);
  }
}

function resetForm() {
  formEl.reset();
  idEl.value = "";
  cancelEditEl.hidden = true;
  formEl.querySelector("button[type=submit]").textContent = "บันทึก learning item";
}

function startEdit(item) {
  idEl.value = item.id;
  titleEl.value = item.title;
  categoryEl.value = item.category;
  statusEl.value = item.status;
  notesEl.value = item.notes;
  githubUrlEl.value = item.githubUrl;
  cancelEditEl.hidden = false;
  formEl.querySelector("button[type=submit]").textContent = "บันทึกการแก้ไข";
  titleEl.focus();
}

function cycleStatus(id) {
  const order = ["not-started", "in-progress", "completed"];
  const items = load();
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  item.status = order[(order.indexOf(item.status) + 1) % order.length];
  save(items);
  render();
}

function removeItem(id) {
  save(load().filter((item) => item.id !== id));
  if (idEl.value === id) resetForm();
  render();
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const item = normalize({
    id: idEl.value || uid(),
    title: titleEl.value,
    category: categoryEl.value,
    status: statusEl.value,
    notes: notesEl.value,
    githubUrl: githubUrlEl.value,
  });
  if (!item.title || !item.category) return;
  const items = load();
  const index = items.findIndex((entry) => entry.id === item.id);
  if (index === -1) items.unshift(item);
  else items[index] = item;
  save(items);
  resetForm();
  render();
});

cancelEditEl.addEventListener("click", resetForm);
for (const control of [searchEl, statusFilterEl, categoryFilterEl]) {
  control.addEventListener("input", render);
  control.addEventListener("change", render);
}

render();
