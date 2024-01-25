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
function selectAndUnselectAllContacts(i, contactCheckbox, oneContact, checkAllCheckbox, event) {
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

/* function areContactsEqual(contact1, contact2) {
  return isEqual(contact1, contact2);
} */

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
  while (calculateTotalWidth(visibleContacts) > maxWidth && visibleContacts.length > 1) {
    visibleContacts.pop();
  }
  visibleContacts.forEach((contact, i) => {
    contactsContainer.innerHTML += generateContactsIconsHTML(i, contact);
    adaptInitialsToBackground(`initials_icon_assigned_${i}`);
  });
  const hiddenContactsCount = Math.max(0, currentContacts.length - visibleContacts.length);
  if (hiddenContactsCount > 0) {
    contactsContainer.innerHTML += generateOverflowIndicatorHTML(hiddenContactsCount);
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

function selectTaskCategory(currentCategoryName, currentCategoryColor) {
  let selectedCategory = {
    category_name: currentCategoryName,
    category_color: currentCategoryColor,
  };

  currentCategories[0] = selectedCategory;
  renderCurrentCategory();
}

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

function closeCategoryLists(idContainer, idArrow) {
  const CATEGORY_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_LIST.classList.remove('show');
  SELECT_ARROW.classList.remove('turn');
}

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

function changeInputBackgroundColor(i, containerType, containerID) {
  const colorInputField = document.getElementById(
    `${containerID}_${containerType}_${i}`
  );
  colorInputField.style.backgroundColor = colorInputField.value;
  colorInputField.addEventListener('input', function () {
    this.style.backgroundColor = this.value;
  });
}

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

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function addNewCategory(i, containerType) {
  let newCategoryColor = document.getElementById(
    `color_new_input_${containerType}_${i}`
  );
  let newCategoryText = document.getElementById(
    `category_new_input_${containerType}`
  );
  let categoryIndex = categories.findIndex(function (item) {
    return item.category_name === newCategoryText.value;
  });
  if (newCategoryText.value !== '') {
    if (categoryIndex === -1) {
      let newCategory = {
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
  } else {
    renderAlert(
      'alert_container',
      'alert_content',
      'Please enter a new category name!'
    );
    renderCategories();
  }
}

function setStandardDateToToday(containerID) {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById(containerID).setAttribute('min', today);
}

function selectDueDate(containerId) {
  const duedateBox = document.getElementById(containerId);
  let newCurrentDueDate = duedateBox.value.trim();
  currentDueDate = newCurrentDueDate;
  renderCurrentDueDate(newCurrentDueDate);
}

function renderCurrentDueDate(newCurrentDueDate) {
  const duedateBoxSmall = document.getElementById('task_due_date_small');
  const duedateBoxBig = document.getElementById('task_due_date_big');
  duedateBoxSmall.value = '';
  duedateBoxBig.value = '';
  duedateBoxSmall.value = newCurrentDueDate;
  duedateBoxBig.value = newCurrentDueDate;
}

async function createNewTask(status, event) {
  event.stopPropagation();
  let formStatus = checkIfBoxesAreEmpty(status);
  if (formStatus) {
    await sendCreatedTask();
  }
}

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

function checkAllRequiredBoxes() {
  return (
    TITLE_BOX.value === '' ||
    DUE_DATE_BOX_SMALL.value === '' ||
    DUE_DATE_BOX_BIG.value === '' ||
    currentCategories.length === 0
  );
}

function checkIfTitleIsEmpty() {
  if (TITLE_BOX.value === '') {
    TASK_TITLE_INFO_BOX.classList.add('visible');
    TITLE_BOX.classList.add('red-border');
  }
}

function checkIfDueDateIsEmpty() {
  if (currentDueDate === '') {
    TASK_DUE_INFO_BOX_SMALL.classList.add('visible');
    TASK_DUE_INFO_BOX_BIG.classList.add('visible');
    DUE_DATE_BOX_SMALL.classList.add('red-border');
    DUE_DATE_BOX_BIG.classList.add('red-border');
  }
}

function checkIfCategoriesIsEmpty() {
  if (currentCategories.length === 0) {
    TASK_CATEGORY_BOX_SMALL.classList.add('visible');
    TASK_CATEGORY_BOX_BIG.classList.add('visible');
    TASK_CATEGORY_SELECT_SMALL.classList.add('red-border');
    TASK_CATEGORY_SELECT_BIG.classList.add('red-border');
  }
}

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

function removeTitleWarning() {
  if (TITLE_BOX.value !== '') {
    TASK_TITLE_INFO_BOX.classList.remove('visible');
    TITLE_BOX.classList.remove('red-border');
  }
}

function removeDueDateWarning() {
  if (currentDueDate !== '') {
    TASK_DUE_INFO_BOX_SMALL.classList.remove('visible');
    DUE_DATE_BOX_SMALL.classList.remove('red-border');
    TASK_DUE_INFO_BOX_BIG.classList.remove('visible');
    DUE_DATE_BOX_BIG.classList.remove('red-border');
  }
}

function removeCategoryWarning() {
  if (currentCategories.length === 1) {
    TASK_CATEGORY_BOX_SMALL.classList.remove('visible');
    TASK_CATEGORY_BOX_BIG.classList.remove('visible');
    TASK_CATEGORY_SELECT_SMALL.classList.remove('red-border');
    TASK_CATEGORY_SELECT_BIG.classList.remove('red-border');
  }
}

TITLE_BOX.addEventListener('blur', function () {
  removeTitleWarning();
});

DUE_DATE_BOX_BIG.addEventListener('blur', function () {
  removeDueDateWarning();
});

DUE_DATE_BOX_SMALL.addEventListener('blur', function () {
  removeDueDateWarning();
});

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

/* --------------------------------------------------------------------
subtask section in add_task.html
---------------------------------------------------------------------- */
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
function addSubtask(inputId, wrapperId, plusIconId) {
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

document
  .getElementById('check_subtask_small')
  .addEventListener('click', function () {
    addSubtask(
      'sub_tasks_small',
      'close_and_check_wrapper_small',
      'subtask_plus_small'
    );
  });

document
  .getElementById('check_subtask_big')
  .addEventListener('click', function () {
    addSubtask(
      'sub_tasks_big',
      'close_and_check_wrapper_big',
      'subtask_plus_big'
    );
  });

document
  .getElementById('sub_tasks_small')
  .addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addSubtask(
        'sub_tasks_small',
        'close_and_check_wrapper_small',
        'subtask_plus_small'
      );
    }
  });

document
  .getElementById('sub_tasks_big')
  .addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addSubtask(
        'sub_tasks_big',
        'close_and_check_wrapper_big',
        'subtask_plus_big'
      );
    }
  });

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

