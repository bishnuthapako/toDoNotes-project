document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');

    const toggleButton = document.getElementById('toggle-button');
    if(localStorage.getItem("toggleEnabled")){
        document.body.className = "dark";
        toggleButton.checked = true
    }
    toggleButton.addEventListener("change", handleToggle)
    function handleToggle(){
        const {checked} = toggleButton;
        if(checked){
            localStorage.setItem("toggleEnabled", checked)
        } else {
            localStorage.removeItem("toggleEnabled")
        }
        // console.log(toggleButton.checked, 'toggle')
        document.body.className = checked ? "dark" : ""

    }

    // Load todos from localStorage
    loadTodos();

    // Add a new todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const todoInput = document.getElementById('todo-input');
        const todoDate = document.getElementById('todo-date');
        const todoPriority = document.getElementById('todo-priority');

        const todo = {
            id: Date.now(),
            title: todoInput.value,
            date: todoDate.value,
            priority: todoPriority.value,
        };

        addTodoToList(todo);
        saveTodoToLocalStorage(todo);

        todoInput.value = '';
        todoDate.value = '';
        todoPriority.value = '';
    });

    // Add a todo to the list
    function addTodoToList(todo) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${todo.title} - ${todo.date} - ${todo.priority}</span>
            <div>
                <button class="edit-btn" data-id="${todo.id}">Edit</button>
                <button class="delete-btn" data-id="${todo.id}">Delete</button>
            </div>
        `;
        todoList.appendChild(li);

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            console.log(e.target.dataset.id, 'id')
            deleteTodoFromLocalStorage(id);
            e.target.parentElement.parentElement.remove();
        });

        li.querySelector('.edit-btn').addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const todo = getTodoFromLocalStorage(id);
            if (todo) {
                editTodo(todo, e.target.parentElement.previousElementSibling);
            }
        });
    }

    function editTodo(todo, todoElement) {
        const title = prompt('Edit todo title:', todo.title);
        const date = prompt('Edit todo date:', todo.date);
        const priority = prompt('Edit todo priority (low, medium, high):', todo.priority);

        if (title && date && priority) {
            todo.title = title;
            todo.date = date;
            todo.priority = priority;
            todoElement.textContent = `${title} - ${date} - ${priority}`;
            updateTodoInLocalStorage(todo);
        }
    }

    // LocalStorage functions
    function saveTodoToLocalStorage(todo) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function deleteTodoFromLocalStorage(id) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos = todos.filter((todo) => todo.id !== parseInt(id));
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function updateTodoInLocalStorage(updatedTodo) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const index = todos.findIndex((todo) => todo.id === updatedTodo.id);
        // console.log(index, 'index-p')
        if (index !== -1) {
            todos[index] = updatedTodo;
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }

    function getTodoFromLocalStorage(id) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        return todos.find((todo) => todo.id === parseInt(id));
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach((todo) => {
            addTodoToList(todo);
        });
    }
});
