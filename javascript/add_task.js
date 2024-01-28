/**
 * This function calls all functions that need
 * to be executed on loading the page.
 */
async function initTasks() {
  init();
  await getTasksFromServer();
  await getContactsFromServer();
  await getCategoriesFromServer();
  showAndHideBoxesAccordingToScreenSize();
  setStandardDateToToday('task_due_date_small');
  setStandardDateToToday('task_due_date_big');
  renderContacts();
  renderCurrentContacts();
  addCheckboxEventListeners();
  renderCategories();
  setupSubtaskEventListener(
    'check_subtask_small',
    'sub_tasks_small',
    'close_and_check_wrapper_small',
    'subtask_plus_small'
  );
  setupSubtaskEventListener(
    'check_subtask_big',
    'sub_tasks_big',
    'close_and_check_wrapper_big',
    'subtask_plus_big'
  );
  renderSubtasks();
}

/**
 * This function renders a list of all available contacts.
 */
function renderContacts() {
  CONTACT_LIST_BOX.innerHTML = '';
  CONTACT_LIST_BOX.innerHTML += generateSelectAllHTML();
  for (i = 0; i < contacts.length; i++) {
    const oneContact = contacts[i];
    CONTACT_LIST_BOX.innerHTML += generateContactListHTML(i, oneContact);
    adaptInitialsToBackground(`initials_icon_in_list_${i}`);
  }
}

/**
 * This function selects or unselects all available contacts.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {HTMLElement} contactCheckbox - This is an individual checkbox for each contact.
 * @param {Object} oneContact - This is a JSON representing
 * one contact in the subarray current_contacts.
 * @param {HTMLElement} checkAllCheckbox - This is a checkbox that selects or unselects
 * all other contacts.
 * @param {MouseEvent} event - This is a click event.
 */
function selectAndUnselectAllContacts(
  i,
  contactCheckbox,
  oneContact,
  checkAllCheckbox,
  event
) {
  event.stopPropagation();
  const individualCheckboxes = document.getElementById(`contact_checkbox_${i}`);
  currentContacts = [];
  if (checkAllCheckbox.checked) {
    individualCheckboxes.checked = true;
    if (!currentContacts.length) {
      currentContacts = [...contacts];
    }
  } else {
    individualCheckboxes.checked = false;
  }
  selectContacts(contactCheckbox, oneContact, event);
  renderCurrentContacts();
}

/**
 * This function adds an event listener to the contact checkboxes in order to
 * register if any changes have been made.
 */
function addCheckboxEventListeners() {
  for (let i = 0; i < contacts.length; i++) {
    const contactCheckbox = document.getElementById(`contact_checkbox_${i}`);
    const checkAllCheckbox = document.getElementById('select_all_checkbox');
    let oneContact = contacts[i];
    contactCheckbox.addEventListener('change', function (event) {
      selectContacts(contactCheckbox, oneContact, event);
    });
    checkAllCheckbox.addEventListener('change', function (event) {
      selectAndUnselectAllContacts(
        i,
        contactCheckbox,
        oneContact,
        checkAllCheckbox,
        event
      );
    });
  }
}

/**
 * This function adds a selected contact to the assigned contacts.
 * @param {HTMLElement} contactCheckbox - This is an individual checkbox for
 * each contact.
 * @param {Object} oneContact - This is one contact from the array contacts.
 * @param {MouseEvent} event - This is a click event.
 */
function selectContacts(contactCheckbox, oneContact, event) {
  event.stopPropagation();
  let selectedContact = {
    name: oneContact.name,
    e_mail: oneContact.e_mail,
    phone: oneContact.phone,
    color: oneContact.color,
  };
  currentContacts = currentContacts.filter(
    (existingContact) => !isEqual(existingContact, selectedContact)
  );
  if (contactCheckbox.checked == true) {
    currentContacts.push(selectedContact);
  }
  renderCurrentContacts();
}

/**
 * This function checks whether two contacts are equal.
 * @param {Object} obj1 - This is a contact from the array current contacts.
 * @param {Object} obj2 - This is the selected contact from the list.
 * @returns - The function returns true if all parameters of a contact match.
 */
function isEqual(obj1, obj2) {
  const entries1 = Object.entries(obj1);
  const entries2 = Object.entries(obj2);
  if (entries1.length !== entries2.length) {
    return false;
  }
  for (let i = 0; i < entries1.length; i++) {
    const key = entries1[i][0];
    const value = entries1[i][1];
    if (value !== obj2[key]) {
      return false;
    }
  }
  return true;
}

/**
 * This function renders all selected contacts into a container underneath
 * the dropdown list.
 */
function renderCurrentContacts() {
  const contactsContainer = document.getElementById('contacts_container');
  contactsContainer.innerHTML = '';
  const maxWidth = contactsContainer.offsetWidth;
  let visibleContacts = [...currentContacts];
  while (
    calculateTotalWidth(visibleContacts) > maxWidth &&
    visibleContacts.length > 1
  ) {
    visibleContacts.pop();
  }
  visibleContacts.forEach((contact, i) => {
    contactsContainer.innerHTML += generateContactsIconsHTML(i, contact);
    adaptInitialsToBackground(`initials_icon_assigned_${i}`);
  });
  const hiddenContactsCount = Math.max(
    0,
    currentContacts.length - visibleContacts.length
  );
  if (hiddenContactsCount > 0) {
    contactsContainer.innerHTML +=
      generateOverflowIndicatorHTML(hiddenContactsCount);
  }
}

/**
 * This function calculates the total width of all contact icons.
 * @param {Array} contacts - This is an array that holds all visible contacts.
 * @returns - The function returns a number that corresponds to the total
 * width of all contact icons in pixels.
 */
function calculateTotalWidth(contacts) {
  const contactWidth = 25;
  return contacts.length * contactWidth;
}

/**
 * This event listener checks if the window is resized and rerenders
 * the contact icons accordingly.
 */
window.addEventListener('resize', function () {
  renderCurrentContacts();
});

/**
 * This function updates the status buttons of a task.
 * @param {string} buttonType - The button type is either 'urgent',
 * 'medium' or 'low'.
 * @param {Boolean} isActive - This is either true or false.
 */
function updateButtons(buttonType, isActive) {
  const smallButton = document.getElementById(
    `prio_button_${buttonType}_small`
  );
  const bigButton = document.getElementById(`prio_button_${buttonType}_big`);

  if (isActive) {
    smallButton.classList.add(`prio-marked-${buttonType}`);
    bigButton.classList.add(`prio-marked-${buttonType}`);
  } else {
    smallButton.classList.remove(`prio-marked-${buttonType}`);
    bigButton.classList.remove(`prio-marked-${buttonType}`);
  }
}

/**
 * This function changes a task's prio status.
 * @param {string} prioStatus - The priority status is either 'urgent',
 * 'medium' or 'low'.
 */
function changePrioStatus(prioStatus) {
  const buttonTypes = ['urgent', 'medium', 'low'];
  buttonTypes.forEach((type) => updateButtons(type, false));
  updateButtons(prioStatus, true);
  if (prioStatus === 'urgent') {
    currentPrio = 'urgent';
  } else if (prioStatus === 'medium') {
    currentPrio = 'medium';
  } else if (prioStatus === 'low') {
    currentPrio = 'low';
  }
}

/**
 * This function renders the available categories for a task.
 */
function renderCategories() {
  CATEGORY_LIST_SMALL.innerHTML = '';
  CATEGORY_LIST_BIG.innerHTML = '';
  let i;
  for (i = 0; i < categories.length; i++) {
    const currentCategory = categories[i];
    CATEGORY_LIST_SMALL.innerHTML += generateCategoryListHTML(
      i,
      currentCategory,
      'small'
    );
    CATEGORY_LIST_BIG.innerHTML += generateCategoryListHTML(
      i,
      currentCategory,
      'big'
    );
  }
  CATEGORY_LIST_SMALL.innerHTML += generateNewCategoryBoxHTML(i, 'small');
  CATEGORY_LIST_BIG.innerHTML += generateNewCategoryBoxHTML(i, 'big');
}

/**
 * With this function the user can select a category from the list.
 * @param {string} currentCategoryName - This is a category's name.
 * @param {color} currentCategoryColor - This is a category's color in form of a hex code.
 */
function selectTaskCategory(currentCategoryName, currentCategoryColor) {
  let selectedCategory = {
    category_name: currentCategoryName,
    category_color: currentCategoryColor,
  };

  currentCategories[0] = selectedCategory;
  renderCurrentCategory();
}

/**
 * This function enables the user to delete a category from the list.
 * @param {number} i - This is the index of a category in the array currentCategories.
 */
function deleteCategory(i) {
  let categoryToBeDeleted = categories[i];
  let categoryIndex = currentCategories.findIndex(function (item) {
    return item.category_name === categoryToBeDeleted.category_name;
  });
  categories.splice(i, 1);
  if (categoryIndex === 0) {
    currentCategories.splice(categoryIndex, 1);
    renderCurrentCategory();
  }
  sendCategoriesToServer();
  renderCategories();
}

/**
 * This function closes the category dropdown list.
 * @param {string} idContainer - This is the id of the container to be closed.
 * @param {string} idArrow - This is the id of the arrow img next to the list.
 */
function closeCategoryLists(idContainer, idArrow) {
  const CATEGORY_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_LIST.classList.remove('show');
  SELECT_ARROW.classList.remove('turn');
}

/**
 * This function renders the selected category into the top container.
 */
function renderCurrentCategory() {
  SELECT_TASK_CATEGORY_ELEMENT_SMALL.innerHTML = '';
  SELECT_TASK_CATEGORY_ELEMENT_BIG.innerHTML = '';
  if (currentCategories.length > 0) {
    const currentCategoryName = currentCategories[0].category_name;
    const currentCategoryColor = currentCategories[0].category_color;
    SELECT_TASK_CATEGORY_ELEMENT_SMALL.innerHTML = generateCurrentCategoryHTML(
      currentCategoryName,
      currentCategoryColor
    );
    SELECT_TASK_CATEGORY_ELEMENT_BIG.innerHTML = generateCurrentCategoryHTML(
      currentCategoryName,
      currentCategoryColor
    );
  } else {
    SELECT_TASK_CATEGORY_ELEMENT_SMALL.innerHTML = 'Select task category';
    SELECT_TASK_CATEGORY_ELEMENT_BIG.innerHTML = 'Select task category';
  }
}

/**
 * This functon enables the user to edit a category.
 * @param {number} i - This is the index of a category in the array currentCategories.
 * @param {string} currentCategoryName - This is the category's name.
 * @param {color} currentCategoryColor - This is a category's color in form of a hex code.
 * @param {string} containerType - This is either 'small' or 'big' for two containers that
 * are shown or hidden according to the window size.
 */
function editCategory(
  i,
  currentCategoryName,
  currentCategoryColor,
  containerType
) {
  const categoryElement = document.getElementById(
    `category_item_${containerType}_${i}`
  );
  categoryElement.innerHTML = '';
  categoryElement.innerHTML = generateCategoryInputHTML(
    i,
    currentCategoryName,
    currentCategoryColor,
    containerType
  );
  changeInputBackgroundColor(i, containerType, 'color_input');
}

/**
 * This function changes the background color of a round icon next
 * to the category if the user edits the color.
 * @param {number} i - This is the index of a category in the array currentCategories.
 * @param {string} containerType - This is either 'small' or 'big'.
 * @param {string} containerID - This is part of the id of the container in question.
 */
function changeInputBackgroundColor(i, containerType, containerID) {
  const colorInputField = document.getElementById(
    `${containerID}_${containerType}_${i}`
  );
  colorInputField.style.backgroundColor = colorInputField.value;
  colorInputField.addEventListener('input', function () {
    this.style.backgroundColor = this.value;
  });
}

/**
 * This function enables the user to change a category's text and color.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {string} containerType - This is either 'small' or 'big'.
 */
function changeCategoryTextAndColor(i, containerType) {
  let colorInputField = document.getElementById(
    `color_input_${containerType}_${i}`
  );
  let categoryTextInputField = document.getElementById(
    `category_input_${containerType}_${i}`
  );
  colorInputField.style.backgroundColor = `${colorInputField.value}`;
  if (categoryTextInputField.value !== '') {
    let updatedCategory = {
      category_name: categoryTextInputField.value.trim(),
      category_color: colorInputField.value,
    };
    categories[i] = updatedCategory;
    renderCategories();
    sendCategoriesToServer();
  } else {
    renderAlert(
      'alert_container',
      'alert_content',
      'Please enter a category name!'
    );
    renderCategories();
  }
}

/**
 * This function enables the user to create a new category.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {string} containerType - This is either 'small' or 'big'.
 */
function createNewCategory(i, containerType) {
  const randomColor = getRandomColor();
  const newCategoryBox = document.getElementById(
    `new_category_${containerType}`
  );
  newCategoryBox.innerHTML = '';
  newCategoryBox.innerHTML = generateInputForNewCategoryHTML(
    i,
    containerType,
    randomColor
  );
  changeInputBackgroundColor(i, containerType, 'color_new_input');
}

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
    addSubtask(tasksId, wrapperId, plusId);
  });

  /**
   * This event listener checks if the enter key is pressed to create a new 
   * subtask.
   */
  document
    .getElementById(tasksId)
    .addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        addSubtask(tasksId, wrapperId, plusId);
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
