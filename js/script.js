const inputEl = document.querySelector('.input');
const addButton = document.querySelector('.add-button');
const todolistEl = document.querySelector('.todolist');

let todos = [];
const TODOS = 'todos';

function addTodo(todo) {
    const id = `${Date.now()}${todos.length}`;
    const li = document.createElement('li');
    li.id = id;
    li.className = 'list-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed || false;
    checkbox.addEventListener('change', toggleCheckbox);
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'checkbox';
    checkboxDiv.appendChild(checkbox);

    const todoName = document.createElement('span');
    todoName.className = 'todo-name';
    todoName.textContent = todo.title;

    const delButton = document.createElement('button');
    delButton.className = 'todo-btn delete';
    delButton.textContent = 'Delete';
    delButton.addEventListener('click', deleteTodo);

    const editButton = document.createElement('button');
    editButton.className = 'todo-btn edit';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', editTodo);

    li.append(checkboxDiv, todoName, delButton, editButton);
    todolistEl.appendChild(li);

    const todoObj = {
        title: todo.title,
        id,
        completed: todo.completed,
    };
    todos.push(todoObj);
    saveTodos();
}

function saveTodos() {
    localStorage.setItem(TODOS, JSON.stringify(todos));
}

function initTodos() {
    const todosFromLS = localStorage.getItem(TODOS);
    if (todosFromLS !== null) {
        const parsedTodos = JSON.parse(todosFromLS);
        for (let i = 0; i < parsedTodos.length; i++) {
            addTodo(parsedTodos[i]);
        }
    }
}
initTodos();

function deleteTodo(event) {
    const button = event.target;
    const li = button.parentElement;
    const filteredTodos = todos.filter((todo) => todo.id !== li.id);
    todos = filteredTodos;
    li.remove();
    saveTodos();
}

function toggleCheckbox(event) {
    const checkbox = event.target;
    const li = checkbox.parentElement.parentElement;
    const changedTodos = todos.map((todo) => {
        if (todo.id === li.id) {
            return {
                ...todo,
                completed: !todo.completed,
            };
        }
        return todo;
    });
    todos = changedTodos;
    saveTodos();
    console.log(todos);
}

function editTodo(event) {
    const button = event.target;
    const id = button.parentElement.id;
    const todoNameEl = button.previousSibling.previousSibling;
    todoNameEl.contentEditable = true;
    todoNameEl.focus();
    const saveButton = document.createElement('button');
    saveButton.className = 'todo-btn save';
    saveButton.textContent = 'Save';
    button.replaceWith(saveButton);
    saveButton.addEventListener('click', () => {
        const editedTodoTitle = todoNameEl.textContent;
        todos = todos.map((todo) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    title: editedTodoTitle,
                };
            }
            return todo;
        });
        saveTodos();
        saveButton.replaceWith(button);
        todoNameEl.contentEditable = false;
    });
}

function handleEvent() {
    const todo = inputEl.value.trim();
    if (todo) {
        addTodo({
            title: todo,
            completed: false,
        });
    }
    inputEl.value = '';
    return;
}

addButton.addEventListener('click', handleEvent);
inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleEvent();
    return;
});
