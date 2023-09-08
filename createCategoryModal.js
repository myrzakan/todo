const openModalBtn = document.querySelector('.add_btn')
const modal = document.querySelector('#modal')
const closeModal = document.querySelector('.closeBtn')
const createCategoryBtn = document.querySelector('.close_btn_category')
const createCategoryInput = document.querySelector('.CreateCategoryInput')


openModalBtn.addEventListener('click', open_Modal)

closeModal.addEventListener('click', close_Modal)

window.addEventListener('click', (e) => {
	if (e.target === modal) {
		close_Modal()
	}
})

// *Events when keys press

document.addEventListener('keydown', e => {
	if (e.key === 'Escape') {
		close_Modal()
	}

  if (e.key === 'Enter') {
    createCategory(createCategoryInput)
  }

})

// *open Modal

function open_Modal () {
	modal.style.visibility = 'visible';

	createCategoryInput.focus()

	
}

// *close Modal

function close_Modal () {
	modal.style.visibility = 'hidden';
}

// *Create category event

createCategoryBtn.addEventListener('click', () => {
  createCategory(createCategoryInput)
})

// *Create category function

function createCategory(categoryTitle) {
  const category = {
    id: generateId(),
    title: categoryTitle.value,
  }

  if (isValidated(categoryTitle)) {
    const categories = getCategories()

    setCategories([...categories, category])

    categoryTitle.value = ''

    reloadPage()
  }
}


// *generateId

function generateId() {
  const categories = getCategories()
  const maxID = categories.reduce((acc, category) => category.id > acc ? category.id : acc, 0)

  return maxID + 1
}



// *Get categories from LS

function getCategories() {
  return JSON.parse(localStorage.getItem('categories')) || []
}

// *Set categories to LS

function setCategories(categories) {
  localStorage.setItem('categories', JSON.stringify(categories))
}

