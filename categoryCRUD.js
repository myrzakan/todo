
const categoryCRUDModal = document.querySelector('#modalCategoryCRUD')
const closeCRUDModal = document.querySelector('.close_btn_CRUD_container')
const editCategoryInput = document.querySelector('.editCategoryInput')
const editCAtegoryBtn = document.querySelector('.editCAtegoryBtn')

closeCRUDModal.addEventListener('click', closeCAtegoryCRUDModal)

window.addEventListener('click', (e) => {
	if (e.target === modal) {
		closeCAtegoryCRUDModal()
	}
})

// *Events when keys press

document.addEventListener('keydown', e => {
	if (e.key === 'Escape') {
		closeCAtegoryCRUDModal()
	}

  if (e.key === 'Enter') {
    isValidatedCRUDInput()
  }

})

// *open Modal

function openCategoryCRUDModal (categoryID) {
    const allCategories = getCategories()
    const foundCategory = allCategories.find(category => category.id === categoryID) 

    editCategoryInput.value = foundCategory.title

    if (editCategoryInput) {
        editCategoryInput.focus();
      }
      

    editCategoryInput.dataset.categoryId = categoryID 

	categoryCRUDModal.style.visibility = 'visible';

}

// *close Modal

function closeCAtegoryCRUDModal () {
	categoryCRUDModal.style.visibility = 'hidden';
}


//* Edit category action

editCAtegoryBtn.addEventListener('click', isValidatedCRUDInput)

function isValidatedCRUDInput () {
    if(isValidated(editCategoryInput)) {
        const categories = getCategories()

        const newCategories = categories.map(category => {
            if (category.id === +editCategoryInput.dataset.categoryId) {


                return {
                    ...category,
                    title: editCategoryInput.value
                }
            }
            return category
        })

        setCategories(newCategories)

        reloadPage()
    }

}