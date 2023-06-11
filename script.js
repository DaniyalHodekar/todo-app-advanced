const form = document.querySelector("form");
const input = document.querySelector("input");
const addButton = document.querySelector(".add-btn");
const listParent = document.querySelector("ul");
const completeButton = document.querySelector(".complete-btn");
const itemsLeftSpan = document.querySelector(".items-left");
const allButton = document.querySelector(".show-all");
const activeButton = document.querySelector(".show-active");
const completedButton = document.querySelector(".show-completed");
const clearButton = document.querySelector(".clear-complete");
const template = document.querySelector("template");
const mobileButtons = document.querySelector(".mobile-buttons");
const desktopButtons = document.querySelector(".buttons");
const themeButton = document.querySelector('.theme-button');
const themeImage = document.querySelector('.icon')

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const currentSrc = themeImage.getAttribute("src");

  // Toggle the image source based on the current source
  if (currentSrc === "/images/icon-sun.svg") {
    themeImage.setAttribute("src", "/images/icon-moon.svg");
  } else {
    themeImage.setAttribute("src", "/images/icon-sun.svg");
  }

});




const LOCAL_STORAGE_PREFIX = "ADVANCED_TODO_LIST-";
const LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;

document.addEventListener("DOMContentLoaded", updateLength);
window.addEventListener("DOMContentLoaded", toggleButtonsVisibility);
window.addEventListener("resize", toggleButtonsVisibility);
function toggleButtonsVisibility() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 520) {
    const mobileShowAll = document.querySelector(".show-all-mobile");
    mobileShowAll.addEventListener("click", showAllTasks);
    const mobileShowActive = document.querySelector(".show-active-mobile");
    mobileShowActive.addEventListener("click", showActiveTasks);
    const mobileShowCompleted = document.querySelector(
      ".show-completed-mobile"
    );
    mobileShowCompleted.addEventListener("click", showCompletedTasks);
    mobileButtons.style.display = "flex";
    desktopButtons.style.display = "none";
  } else {
    mobileButtons.style.display = "none";
    desktopButtons.style.display = "flex";
  }
}
let todos = loadTodos();
todos.forEach(renderToDo);

listParent.addEventListener("change", (e) => {
  if (!e.target.matches("[data-list-item-checkbox]")) return;
  const parent = e.target.closest(".task");
  const todoId = parent.dataset.todoId;
  const todo = todos.find((t) => t.id === todoId);
  todo.complete = e.target.checked;
  saveTodos();
});

listParent.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-delete]")) return;
  const parent = e.target.closest(".task");
  const todoId = parent.dataset.todoId;
  parent.remove();
  todos = todos.filter((todo) => todo.id !== todoId);

  saveTodos();
  updateLength();
});

//user will type todo and add
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value === "") return;
  //get todo

  const newToDo = {
    name: input.value,
    complete: false,
    id: new Date().valueOf().toString(),
  };

  todos.push(newToDo);
  //render todo
  renderToDo(newToDo);
  saveTodos();
  input.value = "";
  updateLength();
});

//------------

function showActiveTasks() {
  const items = listParent.querySelectorAll(".checkbox");
  items.forEach((item) => {
    if (item.checked) {
      item.closest(".task").style.display = "none";
    } else {
      item.closest(".task").style.display = "flex";
    }
  });
}

function showAllTasks() {
  const items = listParent.querySelectorAll(".checkbox");
  items.forEach((item) => {
    item.closest(".task").style.display = "flex";
  });
}

function showCompletedTasks() {
  const items = listParent.querySelectorAll(".checkbox");
  items.forEach((item) => {
    if (!item.checked) {
      item.closest(".task").style.display = "none";
    } else {
      item.closest(".task").style.display = "flex";
    }
  });
}

activeButton.addEventListener("click", showActiveTasks);
allButton.addEventListener("click", showAllTasks);
completedButton.addEventListener("click", showCompletedTasks);

//-------------

clearButton.addEventListener("click", (e) => {
  const items = listParent.querySelectorAll(".checkbox");
  items.forEach((item) => {
    if (item.checked) {
      item.closest(".task").remove();
    }
  });

  todos = todos.filter((todo) => !todo.complete);
  saveTodos();
  updateLength();
});

function renderToDo(todoName) {
  //lets clone the template
  const templateClone = template.content.cloneNode(true);

  const listItem = templateClone.querySelector(".task");
  listItem.dataset.todoId = todoName.id;

  const textElement = templateClone.querySelector("[data-list-text]");
  textElement.innerText = todoName.name;
  const checkbox = templateClone.querySelector(".checkbox");
  if (todoName.complete) {
    textElement.style.textDecoration = "line-through";
    textElement.style.color = "var(--Dark-Grayish-Blue)";
    checkbox.checked = true;
  }
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      textElement.style.textDecoration = "line-through";
      textElement.style.color = "var(--Dark-Grayish-Blue)";
      checkbox.checked = true;
    } else {
      textElement.style.textDecoration = "none";
      textElement.style.color = "var(--Light-Grayish-Blue)";
      checkbox.checked = false;
    }
  });
  listParent.appendChild(templateClone);
}

function saveTodos() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const todostring = localStorage.getItem(LOCAL_STORAGE_KEY);

  return JSON.parse(todostring) || [];
}

function updateLength() {
  itemsLeftSpan.innerText = todos.length;
  const span = document.querySelector(".item-even");
  if (todos.length === 1) {
    span.innerText = "";
  } else {
    span.innerText = "s";
  }
}
