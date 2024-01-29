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