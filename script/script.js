//Seleção de elementos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const search = document.querySelector("#search")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const select = document.querySelector("#filter-select")

let listStorage = []
let oldInputValue

//Funções

//todo list
function saveTodo (text) {
    const todo= document.createElement("li")
    todo.classList.add("todo")
    listStorage.push(text)

    const todoTitle = document.createElement("h3")
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    todoList.appendChild(todo)
    todoInput.value = ""
    todoInput.focus()

    localStorage.setItem('listStorage', JSON.stringify(listStorage))
}

function toggleForms() {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

function updateTodo(text) {
    const todos = document.querySelectorAll(".todo")
    
    let index = listStorage.indexOf(oldInputValue)
    listStorage[index] = text
    localStorage.setItem('listStorage', JSON.stringify(listStorage))

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        }
    })
}

//search
function buscaTodos(text) {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3")
        let todoText = todoTitle.innerText.toLowerCase()

        if(todoText.includes(text)) {
            todo.classList.remove("hide")
        } else {
            todo.classList.add("hide")
        }
    })
}

//filter

function filterTodo(text) {
    const todos = document.querySelectorAll(".todo")

    if(text === "all") {
        todos.forEach((todo) => {
            console.log(todo.classList.contains("todo"))
            if(todo.classList.contains("todo")) {
                todo.classList.remove("hide")
            }
        })
    } else if(text === "done"){
        todos.forEach((todo) => {

            if(todo.classList.contains("done")) {
                todo.classList.remove("hide")
            } else {
                todo.classList.add("hide")
            }
        })
    } else {
        todos.forEach((todo) => {
            if(!(todo.classList.contains("done"))) {
                todo.classList.remove("hide")
            } else {
                todo.classList.add("hide")
            }
        })
    }
}
//Eventos

//todo list
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value
    if(inputValue) {
        saveTodo(inputValue)
    }
})

document.addEventListener("click", (e) => {
    const targetEl = e.target
    const parentEl = targetEl.closest("li")
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText
    }

    if(targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done")
        parentEl.children[1].classList.toggle("active")
        parentEl.children[2].classList.toggle("active")
        parentEl.children[3].classList.toggle("active")
    }

    if(targetEl.classList.contains("remove-todo")) {
        let index = listStorage.indexOf(todoTitle)
        listStorage.splice(index, 1)
        localStorage.setItem('listStorage', JSON.stringify(listStorage))

        parentEl.remove()
    }

    if(targetEl.classList.contains("edit-todo")) {
        toggleForms()

        editInput.value = todoTitle
        oldInputValue = todoTitle
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms()
})


//search
search.addEventListener("submit", (e) => {
    e.preventDefault()
})
searchInput.addEventListener("input", (e) => {
    const text = searchInput.value
    buscaTodos(text.toLowerCase())
})
eraseBtn.addEventListener("click", (e) =>{
    searchInput.value = ""
    buscaTodos("")
})

//Filter
select.addEventListener("change", (e) => {
    const value = select.value
    filterTodo(value)
})


//Função ativa quando carrega a pagina
document.addEventListener("DOMContentLoaded", function() {
    let todos = JSON.parse(localStorage.getItem("listStorage"))
    todos.forEach((text) => {
        saveTodo(text)
    })
})