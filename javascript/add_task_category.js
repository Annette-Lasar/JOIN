/**
 * This function gets a random color for a new category that is suggested
 * to the user. It can be edited according to the user's wishes.
 * @returns - The function returns a randomly created hex code for a color.
 */
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * This function adds a new category to the browser.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {string} containerType - This is either 'small' or 'big'.
 */
async function addNewCategory(i, containerType) {
  const newCategoryColor = document.getElementById(
    `color_new_input_${containerType}_${i}`
  );
  const newCategoryText = document.getElementById(
    `category_new_input_${containerType}`
  );
  if (newCategoryText.value === '') {
    renderAlert(
      'alert_container',
      'alert_content',
      'Please enter a new category name!'
    );
  } else {
    const categoryIndex = categories.findIndex(
      (item) => item.category_name === newCategoryText.value
    );

    if (categoryIndex === -1) {
      const newCategory = {
        category_name: newCategoryText.value.trim(),
        category_color: newCategoryColor.value,
      };
      categories.push(newCategory);
      renderCategories();
      await sendCategoriesToServer();
    } else {
      renderAlert(
        'alert_container',
        'alert_content',
        'This category already exists! Please choose another category name.'
      );
      renderCategories();
    }
  }
}

/**
 * This function gets today's date in the format yyyy-mm-dd
 * @param {string} containerID - This is the input field's id.
 */
function setStandardDateToToday(containerID) {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById(containerID).setAttribute('min', today);
}

/**
 * This function enables the user to select a due date for his task.
 * @param {string} containerId - This is the input field's id.
 */
function selectDueDate(containerId) {
  const duedateBox = document.getElementById(containerId);
  let newCurrentDueDate = duedateBox.value.trim();
  currentDueDate = newCurrentDueDate;
  renderCurrentDueDate(newCurrentDueDate);
}

/**
 * This function renders the new due date into its container.
 * @param {date} newCurrentDueDate - This is the current due date.
 */
function renderCurrentDueDate(newCurrentDueDate) {
  const duedateBoxSmall = document.getElementById('task_due_date_small');
  const duedateBoxBig = document.getElementById('task_due_date_big');
  duedateBoxSmall.value = '';
  duedateBoxBig.value = '';
  duedateBoxSmall.value = newCurrentDueDate;
  duedateBoxBig.value = newCurrentDueDate;
}

/**
 * This function enables the user to create a new task.
 * @param {string} status - A task's status is either 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 * @param {MouseEvent} event - This is a click event.
 */
async function createNewTask(status, event) {
  event.stopPropagation();
  let formStatus = checkIfBoxesAreEmpty(status);
  if (formStatus) {
    await sendCreatedTask();
  }
}

/**
 * This function checks if required input fields are empty. If they aren't
 * it creates a new task.
 * @param {string} status - A task's status is either 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 * @returns
 */
function checkIfBoxesAreEmpty(status) {
  if (checkAllRequiredBoxes()) {
    checkIfTitleIsEmpty();
    checkIfDueDateIsEmpty();
    checkIfCategoriesIsEmpty();
    return false;
  } else {
    let task = createTaskObject(status);
    createdTask = task;
    removeClassLists();
    return true;
  }
}

/**
 * This function checks if the required fields are empty.
 * @returns - The function returns true, if one of the required
 * input fields are empty.
 */
function checkAllRequiredBoxes() {
  return (
    TITLE_BOX.value === '' ||
    DUE_DATE_BOX_SMALL.value === '' ||
    DUE_DATE_BOX_BIG.value === '' ||
    currentCategories.length === 0
  );
}

/**
 * This function creates a warning if the title input box is empty.
 */
function checkIfTitleIsEmpty() {
  if (TITLE_BOX.value === '') {
    TASK_TITLE_INFO_BOX.classList.add('visible');
    TITLE_BOX.classList.add('red-border');
  }
}

/**
 * This function creates a warning if the due date input field is empty.
 */
function checkIfDueDateIsEmpty() {
  if (currentDueDate === '') {
    TASK_DUE_INFO_BOX_SMALL.classList.add('visible');
    TASK_DUE_INFO_BOX_BIG.classList.add('visible');
    DUE_DATE_BOX_SMALL.classList.add('red-border');
    DUE_DATE_BOX_BIG.classList.add('red-border');
  }
}

/**
 * This function creates a warning if no category has been selected.
 */
function checkIfCategoriesIsEmpty() {
  if (currentCategories.length === 0) {
    TASK_CATEGORY_BOX_SMALL.classList.add('visible');
    TASK_CATEGORY_BOX_BIG.classList.add('visible');
    TASK_CATEGORY_SELECT_SMALL.classList.add('red-border');
    TASK_CATEGORY_SELECT_BIG.classList.add('red-border');
  }
}

/**
 * This function creates a new task in form of a JSON.
 * @param {string} taskStatus - A task's status is either 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 * @returns - The function returns a JSON with all the necessary information to
 * create a new task.
 */
function createTaskObject(taskStatus) {
  let newTask = {
    title: TITLE_BOX.value,
    description: DESCRIPTION_BOX.value,
    current_prio: currentPrio,
    current_due_date: currentDueDate,
    current_contacts: currentContacts,
    current_category: currentCategories,
    subtasks: subTasks,
    completed_subtasks: 0,
    status: taskStatus,
  };
  return newTask;
}

/**
 * This function removes all the warnings if the required fields
 * have been filled out.
 */
function removeClassLists() {
  const elementsToRemove = [
    TASK_TITLE_INFO_BOX,
    TITLE_BOX,
    TASK_DUE_INFO_BOX_SMALL,
    TASK_DUE_INFO_BOX_BIG,
    DUE_DATE_BOX_SMALL,
    DUE_DATE_BOX_BIG,
    TASK_CATEGORY_BOX_SMALL,
    TASK_CATEGORY_BOX_BIG,
    TASK_CATEGORY_SELECT_SMALL,
    TASK_CATEGORY_SELECT_BIG,
  ];
  elementsToRemove.forEach((element) =>
    element.classList.remove('visible', 'red-border')
  );
}

/**
 * This function removes the title warning if the input field has been
 * filled out.
 */
function removeTitleWarning() {
  if (TITLE_BOX.value !== '') {
    TASK_TITLE_INFO_BOX.classList.remove('visible');
    TITLE_BOX.classList.remove('red-border');
  }
}

/**
 * This function removes the due date warning, if the input field
 * has been filled out.
 */
function removeDueDateWarning() {
  if (currentDueDate !== '') {
    TASK_DUE_INFO_BOX_SMALL.classList.remove('visible');
    DUE_DATE_BOX_SMALL.classList.remove('red-border');
    TASK_DUE_INFO_BOX_BIG.classList.remove('visible');
    DUE_DATE_BOX_BIG.classList.remove('red-border');
  }
}

  
/**
 * This function removes the category warning if a category has been
 * selected.
 */
function removeCategoryWarning() {
  if (currentCategories.length === 1) {
    TASK_CATEGORY_BOX_SMALL.classList.remove('visible');
    TASK_CATEGORY_BOX_BIG.classList.remove('visible');
    TASK_CATEGORY_SELECT_SMALL.classList.remove('red-border');
    TASK_CATEGORY_SELECT_BIG.classList.remove('red-border');
  }
}

/**
 * This event listener checks if the title input field is empty.
 */
TITLE_BOX.addEventListener('blur', function () {
  removeTitleWarning();
});

/**
 * This event listener checks if the due date input field is empty.
 */
DUE_DATE_BOX_BIG.addEventListener('blur', function () {
  removeDueDateWarning();
});

/**
 * This event listener checks a category has been selected.
 */
DUE_DATE_BOX_SMALL.addEventListener('blur', function () {
  removeDueDateWarning();
});

/**
 * This function resets all input fields buttons and dropdown lists
 * to their original state.
 */
function clearAllTaskContainers() {
  TITLE_BOX.value = '';
  DESCRIPTION_BOX.value = '';
  currentPrio = 'medium';
  currentDueDate = '';
  renderCurrentDueDate(currentDueDate);
  currentContacts = [];
  renderCurrentContacts();
  currentCategories = [];
  renderCurrentCategory();
  subTasks = [];
  renderSubtasks();
}

