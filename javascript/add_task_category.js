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
  TASK_TITLE_INFO_BOX.classList.remove('visible');
  TITLE_BOX.classList.remove('red-border');
  TASK_DUE_INFO_BOX_SMALL.classList.remove('visible');
  TASK_DUE_INFO_BOX_BIG.classList.remove('visible');
  DUE_DATE_BOX_SMALL.classList.remove('red-border');
  DUE_DATE_BOX_BIG.classList.remove('red-border');
  TASK_CATEGORY_BOX_SMALL.classList.remove('visible');
  TASK_CATEGORY_BOX_BIG.classList.remove('visible');
  TASK_CATEGORY_SELECT_SMALL.classList.remove('red-border');
  TASK_CATEGORY_SELECT_BIG.classList.remove('red-border');
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

/**
 * Shows two buttons that enable the user to either refuse or accept
 * the input value as a new subtask
 * @param {string} wrapperId - id of the div element that contains the x and the accept icon
 * The id can either refer to the div element in the mobile view or the one in the desktop view
 * @param {string} plusIconId - id of the plus icon (either mobile or desktop)
 * that holds the onclick function
 */
function showCancelAndAcceptSubtask(wrapperId, plusIconId) {
  const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);
  const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
  CLOSE_AND_CHECK_WRAPPER.classList.remove('d-none');
  SUBTASK_PLUS_ICON.classList.add('d-none');
}

/**
 * This function clears the input field if the user wants to abort the operation.
 * @param {string} inputId - All these IDs can either refer to the html element for the
 * mobile view (small) or for the desktop view (big)
 * @param {string} wrapperId - see above
 * @param {string} plusIconId - see above
 */
function clearSubtask(inputId, wrapperId, plusIconId) {
  const SUBTASK_INPUT_BOX = document.getElementById(inputId);
  const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
  const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);
  SUBTASK_INPUT_BOX.value = '';
  hideCancelAndAcceptSubtask(CLOSE_AND_CHECK_WRAPPER, SUBTASK_PLUS_ICON);
}

/**
 * This function returns to the view with the plus icon instead of the x or accept icon
 * @param {*} CLOSE_AND_CHECK_WRAPPER
 * @param {*} SUBTASK_PLUS_ICON
 */
function hideCancelAndAcceptSubtask(
  CLOSE_AND_CHECK_WRAPPER,
  SUBTASK_PLUS_ICON
) {
  CLOSE_AND_CHECK_WRAPPER.classList.add('d-none');
  SUBTASK_PLUS_ICON.classList.remove('d-none');
}

/**
 * With this function the user can delete a certain subtask.
 * @param {integer} i - This is the index that refers to the current subtask.
 */
function deleteSubtask(i) {
  subTasks.splice(i, 1);
  renderSubtasks();
}

/**
 * With this function the user can add subtasks which are shown in a list underneath
 * the input field.
 * @param {string} inputId - All these strings refer to IDs that are transferred as
 * parameters in the onclick functions in the html code. There are two different
 * parameters ('small' and 'big') according to whether the function is executed in
 * the mobile or the desktop version of the app.
 * @param {string} wrapperId - see above
 * @param {string} plusIconId - see above
 */
function addSubtask(inputId, wrapperId, plusIconId, event) {
  event.stopPropagation();
  const SUBTASK_INPUT_BOX = document.getElementById(inputId);
  const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
  const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);

  if (SUBTASK_INPUT_BOX.value !== '') {
    const newSubtask = {
      subtask_name: SUBTASK_INPUT_BOX.value,
      checked_status: false,
    };
    subTasks.push(newSubtask);
  } else {
    renderAlert(
      'alert_container',
      'alert_content',
      'Please enter text for your subtask!'
    );
  }
  renderSubtasks();
  SUBTASK_INPUT_BOX.value = '';
  hideCancelAndAcceptSubtask(CLOSE_AND_CHECK_WRAPPER, SUBTASK_PLUS_ICON);
}

/**
 * This function sets an event listener so that the user can add a
 * subtask by pressing the enter key.
 * @param {string} elementId - This is the id of the button that creates a new subtask.
 * @param {string} tasksId - This is the id of the input field.
 * @param {string} wrapperId - This is the id of the close and check wrapper.
 * @param {string} plusId - This is the id of the plus button.
 */
function setupSubtaskEventListener(elementId, tasksId, wrapperId, plusId) {
  document.getElementById(elementId).addEventListener('click', function () {
    addSubtask(tasksId, wrapperId, plusId, event);
  });

  /**
   * This event listener checks if the enter key is pressed to create a new
   * subtask.
   */
  document
    .getElementById(tasksId)
    .addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        addSubtask(tasksId, wrapperId, plusId, event);
      }
    });
}

/**
 * With this function the subtasks of the array subTasks are rendered in the browser.
 */
function renderSubtasks() {
  SUBTASK_CONTAINER_SMALL.innerHTML = '';
  SUBTASK_CONTAINER_BIG.innerHTML = '';
  for (let i = 0; i < subTasks.length; i++) {
    let subtask = subTasks[i];
    SUBTASK_CONTAINER_SMALL.innerHTML += generateSubtaskHTML(
      i,
      subtask,
      'small'
    );
    SUBTASK_CONTAINER_BIG.innerHTML += generateSubtaskHTML(i, subtask, 'big');
  }
}

/**
 * This function enables the user to edit his subtasks. It accesses the html element
 * that contains the subtask in question by its ID and exchanges the element for an
 * input field.
 * @param {integer} i - This is the index of the current subtask.
 * @param {string} containerType - This is either 'small' or 'big' and refers to the
 * viewport size (mobile or desktop.
 * @param {string} subtask - This is the text of the current subtaks.
 */
function editSubtask(i, containerType, subtask) {
  let subtaskElement = document.getElementById(
    `subtask_list_wrapper_${containerType}_${i}`
  );
  subtaskElement.innerHTML = generateInputEditHTML(i, containerType, subtask);
}

/**
 * This function enables the user to edit a subtask's text.
 * @param {number} i - This is the index of a subtask in the subarray subtasks.
 * @param {string} containerType - This is either 'small' or 'big'.
 */
function changeSubtaskText(i, containerType) {
  let editedInput = document.getElementById(`edit_input_${containerType}_${i}`);
  let editedSubtask = editedInput.value.trim();
  if (editedSubtask !== '') {
    subTasks[i].subtask_name = editedSubtask;
    renderSubtasks();
  } else {
    renderAlert(
      'alert_container',
      'alert_content',
      'Please enter text for your subtask'
    );
    renderSubtasks();
  }
}
