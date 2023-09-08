const $title = document.querySelector('.titleInput')
const $description = document.querySelector('.descriptionInput')
const $addBtn = document.querySelector('.addBtn')
const $container = document.querySelector('.todos')
const $categorySelect = document.querySelector('.categorySelect')
const $categoryFilterSelect = document.querySelector('.categoryFilterSelect')

const BASE_URL = 'https://todo-fe7d7-default-rtdb.asia-southeast1.firebasedatabase.app'

// ?Load todos from local storage
window.addEventListener('load', () => {

	getTodosRequest() 

})


// ? load category from js 
window.addEventListener('load', () => {
	const categories = getCategories()

	categories.forEach(category => {
		$categorySelect.insertAdjacentHTML('beforeend', categoryTemplate(category))
		$categoryFilterSelect.insertAdjacentHTML('beforeend', categoryTemplate(category))
	})	
})



// ?Validated

function openAddbtn () {
	if (isValidated($title) && isValidated($categorySelect) && isValidated($description)) {
		createTodo({ 
			title: $title.value,
			description: $description.value,
			category: $categorySelect.value
		})
	}
}

// ? OpenBtn

$addBtn.addEventListener('click', openAddbtn)

document.addEventListener('keydown', e => {
	if (e.key === 'Enter') {
		openAddbtn()
	}
})

// ? CardTemplated


function cardTemplate(todo) {
	const {
		title,
		description,
		id,
		completed,
		createdAt,
		editedAt,
		category,
	} = todo

	const categories = getCategories()

	const foundCategory = categories.find(ctd => ctd.id === +category)

	const isLongText = description.length > 350

	return `
    <div class="todoCard ${completed ? 'completed' : ''}" >
      <h2>${title}</h2>

	  ${
		foundCategory ? `<p>Категория: <strong onclick="openCategoryCRUDModal(${category})" 
		style=
		"cursor: pointer; 
		text-decoration: underline;">
		${foundCategory.title}</strong></p>` : ''
	  }
	  
      <div class="content">
        <div class="${isLongText ? 'shorten' : 'descriptionContainer'}">
          <p>${description}</p>
        </div>

        <p class="dates">
          <span>${createdAt}</span>
          ${editedAt ? `<span>Edited at: ${editedAt}</span>` : ''}
        </p>
      </div>

      <div>
        <button class='CompleteBtn' onclick="completeTodo('${id}')">Complete</button>
        <button class='deleteBtn' onclick="deleteTodo('${id}')">Delete</button>
        <button class='EditBtn' onclick="editTodo('${id}')">Edit</button>
      </div>
    </div>  
  `
}


// ? CategoryTemplate

function categoryTemplate(category) {
	const {
		id,
		title
	} = category

	return `
	<option value="${id}">
	${title }
	</option>
	
	`
}



// ? CreateTodo

async function createTodo({ title, description, category }) {

	const todo = {
		title: title.trim(),
		description: description.trim(),
		completed: false,
		createdAt: currentDate(),
		editedAt: null,
		category,
	}


	//? POST 

	try {
		 await fetch(`${BASE_URL}/todos.json`, {
			method: 'POST',
			body: JSON.stringify(todo),
		})

	
	    resetFields()

		$container.insertAdjacentHTML('afterbegin', cardTemplate(todo))

		

	} catch (e) {
		console.error(e)
	}
}

//? Get todos 

async function getTodosRequest() {
	try {
		const response = await fetch(`${BASE_URL}/todos.json`)

		const todos = await response.json()

		const todoArr = Object.entries(todos).map(([id, val]) => {
			return {
				id,
				...val
			}
		}) 

		const tempLate = todoArr.reverse().reduce((acc, todo) => acc + cardTemplate(todo), '')

		$container.innerHTML = tempLate

	} catch (e) {
		console.error(e)
	}
}


//? Delete Card

async function deleteTodo(id) {

	try {

		const confirmDelete = confirm('Are you sure?')
  
     	if (!confirmDelete) return

		await fetch(`${BASE_URL}/todos/${id}.json`, {
			method: 'DELETE'
		})

		await getTodosRequest()


	} catch (e) {
		console.error(e)
	}
	
  }


//? Completed  Card

async function completeTodo(id) {

	try {
		await fetch(`${BASE_URL}/todos/${id}.json`, {
			method: 'PATCH',
			body: JSON.stringify({
				completed: true,

			})
		})

		await getTodosRequest()

	} catch (e) {
		console.error(e)
	}


// 	const todos = getTodos()


// 	const updatedTodos = todos.map(todo => {
// 		if (todo.id === id) {
// 			todo.completed = !todo.completed
// 		}

// 		return todo
// 	})

// 	setTodos(updatedTodos)

// 	reloadPage()
}


//? Edit Card

function editTodo(id) {
	const updatedTodos = getTodos().map(todo => {
		if (todo.id === id) {
			todo.title = prompt('Title', todo.title) || todo.title
			todo.description = prompt('Description', todo.description) || todo.description
			todo.editedAt = currentDate()
		}

		return todo
	})

	setTodos(updatedTodos)

	reloadPage()
}

//? Filter category

$categoryFilterSelect.addEventListener('change', e => {
	const categoryId = e.target.value
	const todos = getTodos()
	$container.innerHTML = ''

	if (!categoryId) {
		
		todos.reverse().forEach(todo => {
			$container.insertAdjacentHTML('beforeend', cardTemplate(todo))
		})

		return
	}

	const filteredTodosByCategory = todos.filter(todos => todos.category === categoryId)

	filteredTodosByCategory.reverse().forEach(todo => {
		$container.insertAdjacentHTML('beforeend', cardTemplate(todo))
	})
})


//! ======================================================Utilities===================================================== 

// ? isValidated

function isValidated(element) {
	if (!element.value) {
		element.classList.add('error')

		element.focus()

		return false
	}

	element.classList.remove('error')
	return true
}



// ?Get categories from LS

function getCategories() {
	return JSON.parse(localStorage.getItem('categories')) || []
  }



//? resetField 

function resetFields() {
	$title.value = ''
	$description.value = ''
	$categorySelect.value = ''
}


// ?Current date function

function currentDate() {
	return new Date().toLocaleString()
}


// ?Id Generator

function generateId() {
	const todos = getTodos();
	let maxID = todos.length > 0 ? 
	todos.reduce((acc, todo) => todo.id > acc ? todo.id : acc, 0) : 0;
	
	
	return maxID + 1;
  }
  


// ?Get todos function

function getTodos() {
	const storedTodos = localStorage.getItem('todos');
	if (storedTodos !== null) {
	  return JSON.parse(storedTodos);
	} else {
	  return [];
	}
  }

// ?Set todo function

function setTodos(todos) {
	localStorage.setItem('todos', JSON.stringify(todos))
}

// ?Reload page function

function reloadPage() {
	window.location.reload()
}


