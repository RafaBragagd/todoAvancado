/*----------------------Novo codigo--------------------*/

const todoList = document.querySelector("#todo-list")
const todoForm = document.querySelector("#todo-form")
const todoTitle = document.querySelector("#todo-title")
const todoTags = document.querySelector("#todo-tags")
const todoCategory = document.querySelector("#select-category")
const todoOvertime = document.querySelector("#todo-overtime")
const todoPriority = document.querySelector("#select-priority")
const todoAddCat = document.querySelector("#add-category")
const categorySelector = document.querySelector("#category-selector")
const categoryForm = document.querySelector(".category-form")
const btnCategoryAdd = document.querySelector("#add-category-form")
const CategoryText  = document.querySelector("#text-category")
const categoryList = document.querySelector("#category-list")
const closeCategory = document.querySelector("#fechar-categoria")
const search = document.querySelector("#search")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const select = document.querySelector("#filter-select")
const editForm = document.querySelector("#edit-form")
const divTodoList = document.querySelector("#todo-list-div")
const editTitle = document.querySelector("#todo-title-edit")
const editTags = document.querySelector("#todo-tags-edit")
const editCategory = document.querySelector("#select-category-edit")
const editOvertime = document.querySelector("#todo-overtime-edit")
const editPriority = document.querySelector("#select-priority-edit")
const btnCancel = document.querySelector("#btn_cancel")
const editSubmit = document.querySelector("#btn_submit_edit")


let open = todoList
let todoEdit
let listStorage = []
let listcategory = []

//Configuração do Flatpickr
const flatinput = flatpickr(todoOvertime, {
    enableTime: true,
    clickOpens: false,
    locale: "pt",
    dateFormat: "d/m/Y, H:i",
    minDate: new Date(),
    defaultDate: inXHours(1)
});
const flatinputEdit = flatpickr(editOvertime, {
    enableTime: true,
    clickOpens: false,
    locale: "pt",
    dateFormat: "d/m/Y, H:i",
    minDate: new Date(),
});

todoOvertime.addEventListener('click', () => {
    
    if(flatinput.isOpen){
        flatinput.close()
    } else {
        flatinput.open()
    }
})
editOvertime.addEventListener('click', () => {
    
    if(flatinput.isOpen){
        flatinput.close()
    } else {
        flatinput.open()
    }
})
todoForm.addEventListener('change', () => {
    if(!(todoOvertime.value)){
        flatinput.setDate(inXHours(1))
    }
})
//Configuração das classes
class setTarefa {
    constructor(titulo, prioridade, categoria, tags, dataConclusao, notas = "", status = "pending", dataConcluido = new Date(), id = null) {
        this.id = id === null ? parseInt(localStorage.getItem("idTarefa")) + 1 : id //pega o id da localstorage e soma 1 para a próxima tarefa
        this.titulo = titulo
        this.dataCriacao = new Date().toLocaleDateString() //pega a data atual do computador
        this.dataConclusao = dataConclusao
        this.prioridade = prioridade
        this.status = status
        this.notas = notas
        this.categoria = categoria
        this.tags = tags
        this.dataConcluido = dataConcluido

        localStorage.setItem('idTarefa', (this.id))
    }
}
  
//Funções
function inXHours(addHour){
    let dateObj = new Date()
    dateObj.setHours(dateObj.getHours() + addHour)
    return dateObj
}
function filterTodo(text) {
    const todos = document.querySelectorAll(".todo")

    if(text === "all") {
        todos.forEach((todo) => {
                todo.classList.remove("hide")
        })
    }else if(text === "done"){
        todos.forEach((todo) => {

            if(todo.classList.contains("done")) {
                todo.classList.remove("hide")
            } else {
                todo.classList.add("hide")
            }
        })
    } else if(text === "pending"){
        todos.forEach((todo) => {
            if(todo.classList.contains("pending")) {
                todo.classList.remove("hide")
            } else {
                todo.classList.add("hide")
            }
        })
    }else if(text === "progress"){
        todos.forEach((todo) => {
            if(todo.classList.contains("progress")) {
                todo.classList.remove("hide")
            } else {
                todo.classList.add("hide")
            }
        })
    } else {
        todos.forEach((todo) => {
            const categoria = todo.querySelector(".category")
            if(categoria.innerText === text){
                todo.classList.remove("hide")
            }else{
                todo.classList.add("hide")
            }
        })
    }
}
function buscaTodos(text) {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h2")
        const todoTag = (todo.querySelector(".tag")).querySelector("p")
        const todoCat = (todo.querySelector(".basic")).querySelector(".category")
        let tagText = todoTag.innerText.toLowerCase()
        let todoText = todoTitle.innerText.toLowerCase()
        let cateText = todoCat.innerText.toLowerCase()

        if((todoText.includes(text))||(tagText.includes(text))||cateText.includes(text)) {
            todo.classList.remove("hide")
        } else {
            todo.classList.add("hide")
        }
    })
}
function cadastroReset(){
    todoTitle.value = ""
    todoCategory.selectedIndex = 0
    todoTags.value = ""
    todoPriority.selectedIndex = 0
    flatinput.setDate(inXHours(1))
}
function prioritySelector(selected){
    let select
    if(selected === "baixa"){
        select = "3"
    } else if(selected === "media"){
        select = "2"
    } else {
        select = "1"
    }
    return select
}
function statusSelector(selected){
    let select
    if(selected === "pending"){
        select = "Pendente"

    } else if(selected === "progress"){
        select = "Andamento"
    } else {
        select = "Concluido"
    }
    return select
}
function HTMLstring(tarefa){
    let date = new Date(tarefa.dataConclusao)
    let todoString = `
    <div class="cabecalho">
        <h2>${tarefa.titulo}<span class="selectbox priority ${tarefa.prioridade}">
            <span class="selected-value">${prioritySelector(tarefa.prioridade)}</span>
            <ul class="options">
                <li data-value="baixa" class="priority-option">Baixa</li>
                <li data-value="media" class="priority-option">Media</li>
                <li data-value="alta" class="priority-option">Alta</li>
            </ul>
        </span></h2>
        <div class="selectbox status">
            <span class="selected-value">${statusSelector(tarefa.status)}</span>
            <ul class="options">
                <li data-value="pending" class="option">Pendente</li>
                <li data-value="progress" class="option">Andamento</li>
                <li data-value="done" class="option">Concluido</li>
            </ul>
        </div>
    </div>
    <div class="info">
        <span class="basic"><p class="category">${tarefa.categoria}</p><p class="origem">${tarefa.dataCriacao}</p></span>
        <span class="tag"><h5>Tags:</h5><p>${tarefa.tags}</p></span>
        <span class="overtime"><h5>Data Limite: </h5><p>${`${date.toLocaleDateString()}, ${date.getHours()}:${date.getMinutes()}`}</p></span>
        <span class="conclusion"><h5>Concluido: </h5><p>${tarefa.dataConclusao}</p></span>
    </div>
    <div class="tools">
        <textarea type="text" class="notes">${tarefa.notas}</textarea>
        <button class="btn-notes">Notas</button>
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Deletar</button>
    </div>
    `
    return todoString
}
function criarTarefa(index){
    tarefa = listStorage[index]
    const todo = document.createElement("li")
    todo.classList.add("todo")
    todo.classList.add(`${tarefa.status}`)
    id = "todo" + tarefa.id
    todo.id = id
    
    todo.innerHTML = HTMLstring(tarefa)
    todoList.appendChild(todo)

    const todoHTML = document.querySelector(`#${id}`)
    const notes = todoHTML.querySelector(".notes")
    notes.addEventListener("change", (e)=> {
        parent = (e.target.parentNode).parentNode
        id = (parent.id).slice(4)
        const tarefaEncontrado = listStorage.find(objeto => objeto.id === parseInt(id));
        tarefaEncontrado.notas = e.target.value
        localStorage.setItem('listStorage', JSON.stringify(listStorage))
    })
    localStorage.setItem('listStorage', JSON.stringify(listStorage))
}
function editarTarefa(tarefa){
    tarefa.titulo = editTitle.value
    tarefa.tags = editTags.value
    tarefa.categoria = editCategory.value
    tarefa.dataConclusao = flatpickr.parseDate(editOvertime.value, "d/m/Y, H:i")
    tarefa.prioridade = editPriority.value

    let HTML = HTMLstring(tarefa)
    todoEdit.innerHTML = HTML

    localStorage.setItem('listStorage', JSON.stringify(listStorage))
}
function criarCategoria(index){
    let option = document.createElement('option')
    option.value = listcategory[index]
    option.text = listcategory[index]
    todoCategory.appendChild(option)
    option = option.cloneNode(true)
    select.appendChild(option)
    option = option.cloneNode(true)
    editCategory.appendChild(option)
    const li = document.createElement('li')
    const liHTML = `<p>${listcategory[index]}</p> <button class="btnRemove" data-value="${listcategory[index]}"><i class="fa-solid fa-trash"></button></i>`
    li.innerHTML = liHTML
    categoryList.appendChild(li) 
}

function toggleForm() {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    divTodoList.classList.toggle("hide")
}
function populaEdit(index){
    const tarefa = listStorage[index]
    let indice = 0
    editTitle.value = tarefa.titulo
    editTags.value = tarefa.tags
    for (let i = 0; i < editCategory.options.length; i++) {
        if (editCategory.options[i].value === tarefa.categoria) {
          indice = i
          break;
        }
    }
    editCategory.selectedIndex = indice
    flatinputEdit.setDate(tarefa.dataConclusao)
    for (let i = 0; i < editPriority.options.length; i++) {
        if (editPriority.options[i].value === tarefa.prioridade) {
          indice = i
          break;
        }
    }
    editPriority.selectedIndex = indice
}

if (!localStorage.getItem('idTarefa')){
    localStorage.setItem('idTarefa', -1)
}

//todo list
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = todoTitle.value
    const category = todoCategory.value
    const tags = todoTags.value
    const priority = todoPriority.value
    const overtime = flatpickr.parseDate(todoOvertime.value, "d/m/Y, H:i")
    if(title) {
        listStorage.push(new setTarefa(title, priority, category, tags, overtime))
        criarTarefa(listStorage.length - 1)
        cadastroReset()
    }
})
todoAddCat.addEventListener("click", () => {
    categoryForm.classList.toggle("active")
})
btnCategoryAdd.addEventListener("click", () => {
    if(CategoryText.value){
        listcategory.push(CategoryText.value)
        criarCategoria(listcategory.length - 1)
        localStorage.setItem('listCategory', JSON.stringify(listcategory))
        CategoryText.value = ""
        categoryForm.classList.remove("active")
    }
    
})
closeCategory.addEventListener("click", ()=>{
    categoryForm.classList.toggle("active")
})
btnCancel.addEventListener("click", ()=> {
    toggleForm()
})
editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    id = (todoEdit.id).slice(4)
    
    const indexEncontrado = listStorage.findIndex(objeto => objeto.id === parseInt(id));
    
    editarTarefa(listStorage[indexEncontrado])
    toggleForm()
})
//Configuração das funcionalidades do ToDo
document.addEventListener('click', function(e) {
    //Abre e fecha os select customizados
    if (e.target.classList.contains('selectbox')) {
        if (open != e.target){
            open.classList.remove("open")
        }
        e.target.classList.toggle("open")
        open = e.target

    //Seleciona as opções de status das tarefas
    } else if(e.target.classList.contains('option')){
        parent = (e.target.parentNode).parentNode
        parentLI = (parent.parentNode).parentNode
        title = parent.querySelector(".selected-value")
        title.textContent = statusSelector(e.target.dataset.value)

        id = (parentLI.id).slice(4)
        const tarefaEncontrado = listStorage.find(objeto => objeto.id === parseInt(id));
        tarefaEncontrado.status = e.target.dataset.value

        if ((e.target.dataset.value) === "done"){
            conclusao = (parentLI.querySelector(".conclusion")).querySelector("p")

            const now = new Date()
            const formattedDateTime = `${now.toLocaleDateString()}, ${now.getHours()}:${now.getMinutes()}`
            conclusao.textContent = formattedDateTime
            tarefaEncontrado.dataConcluido = formattedDateTime

            parentLI.classList.add("done")
            parentLI.classList.remove("pending")
            parentLI.classList.remove("progress")
            
        }else  if ((e.target.dataset.value) === "pending"){
            parentLI.classList.remove("done")
            parentLI.classList.add("pending")
            parentLI.classList.remove("progress")
        } else {
            parentLI.classList.remove("done")
            parentLI.classList.remove("pending")
            parentLI.classList.add("progress")
        }

        localStorage.setItem('listStorage', JSON.stringify(listStorage))
        open.classList.remove("open")

    //Seleciona as opções de prioridade
    }else if(e.target.classList.contains('priority-option')){
        parent = (e.target.parentNode).parentNode
        parentLI = ((parent.parentNode).parentNode).parentNode
        title = parent.querySelector(".selected-value")
        selected = prioritySelector(e.target.dataset.value)
        title.textContent = selected
        if(selected === "1"){
            parent.classList.remove("baixa")
            parent.classList.remove("media")
            parent.classList.add("alta")
        } else if(selected === "2"){
            parent.classList.remove("alta")
            parent.classList.remove("baixa")
            parent.classList.add("media")
        } else{
            parent.classList.remove("alta")
            parent.classList.remove("media")
            parent.classList.add("baixa")
        }
        id = (parentLI.id).slice(4)
        const tarefaEncontrado = listStorage.find(objeto => objeto.id === parseInt(id));
        tarefaEncontrado.prioridade = e.target.dataset.value
        localStorage.setItem('listStorage', JSON.stringify(listStorage))
        open.classList.remove("open")

    //abre e fecha as notas das tarefas
    }else if((e.target.classList.contains('btn-notes'))){
        parent = e.target.parentNode
        textArea = parent.querySelector(".notes")
        textArea.classList.toggle("open")
        e.target.classList.toggle("active")


    }else if(e.target.classList.contains("btn-delete")){
        parent = (e.target.parentNode).parentNode
        id = (parent.id).slice(4)
    
        const indexEncontrado = listStorage.findIndex(objeto => objeto.id === parseInt(id));
        listStorage.splice(indexEncontrado, 1)
        
        parent.remove()
        localStorage.setItem('listStorage', JSON.stringify(listStorage))

    }else if(e.target.classList.contains("btnRemove")){
        const parent = e.target.parentNode
        let opcao = todoCategory.querySelector(`option[value="${e.target.dataset.value}"]`)
        const index = listcategory.indexOf(e.target.dataset.value)
        todoCategory.removeChild(opcao)
        opcao = select.querySelector(`option[value="${e.target.dataset.value}"]`)
        select.removeChild(opcao)
        parent.remove()
        listcategory.splice(index, 1);
        localStorage.setItem('listCategory', JSON.stringify(listcategory))

    }else if(e.target.classList.contains("btn-edit")){
        todoEdit = (e.target.parentNode).parentNode
        id = (todoEdit.id).slice(4)
        toggleForm()
        const indexEncontrado = listStorage.findIndex(objeto => objeto.id === parseInt(id));
        populaEdit(indexEncontrado)
    }else{
        open.classList.remove("open")
    }
})
select.addEventListener("change", (e) => {
    const value = select.value
    filterTodo(value)
})
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
document.addEventListener("DOMContentLoaded", function() {
    listStorage = JSON.parse(localStorage.getItem("listStorage"))
    let index = 0
    listStorage.forEach(() => {
        criarTarefa(index)
        index++
    })
    listcategory = JSON.parse(localStorage.getItem("listCategory"))
    index = 0
    listcategory.forEach(() => {
        criarCategoria(index)
        index++
    })
})