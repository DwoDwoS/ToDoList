/* ========= Sélecteurs ========= */
const FORM        = document.getElementById('todo-form');
const INPUT       = document.getElementById('todo-input');
const LIST        = document.getElementById('todo-list');
const CLEAR_ALL_BTN = document.getElementById('clear-all');
const THEME_BTN    = document.getElementById('theme-toggle');

/* ========= Données ========= */
let todos = [];

/* ========= Thème clair / sombre ========= */
function setTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  THEME_BTN.innerHTML = theme === 'dark'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
}
function initTheme(){
  const SAVED = localStorage.getItem('theme');
  const PREFERS_DARK = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(SAVED || (PREFERS_DARK ? 'dark' : 'light'));
}
THEME_BTN.addEventListener('click', () => {
  const CURRENT = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(CURRENT);
});
initTheme();

/* ========= LocalStorage ========= */
function saveTodos(){
  localStorage.setItem('todos', JSON.stringify(todos));
}

/* ========= Rendu d’une tâche ========= */
function renderTodo(todo){
  const LI = document.createElement('li');
  LI.textContent = todo.text;
  if (todo.done) LI.classList.add('done');

  // Marquer comme terminée
  LI.addEventListener('click', () => {
    todo.done = !todo.done;
    LI.classList.toggle('done');
    saveTodos();
  });

  // Bouton suppression
  const DELETE_BTN = document.createElement('button');
  DELETE_BTN.className = 'trash-btn';
  DELETE_BTN.innerHTML = '<i class="fa-solid fa-trash"></i>';
  DELETE_BTN.addEventListener('click', e => {
    e.stopPropagation();
    todos = todos.filter(t => t !== todo);
    LI.remove();
    saveTodos();
  });

  LI.appendChild(DELETE_BTN);
  LIST.appendChild(LI);
}

/* ========= Chargement initial ========= */
window.addEventListener('DOMContentLoaded', () => {
  const STORED = localStorage.getItem('todos');
  if (STORED){
    todos = JSON.parse(STORED);
    todos.forEach(renderTodo);
  }
});

/* ========= Ajout d’une tâche ========= */
FORM.addEventListener('submit', e => {
  e.preventDefault();
  const TASK = INPUT.value.trim();
  if (!TASK) return;

  const TODO = { text: TASK, done: false };
  todos.push(TODO);
  renderTodo(TODO);
  saveTodos();
  INPUT.value = '';
});

/* ========= Suppression totale ========= */
CLEAR_ALL_BTN.addEventListener('click', () => {
  if (confirm('Supprimer toutes les tâches ?')){
    todos = [];
    LIST.innerHTML = '';
    saveTodos();
  }
});
