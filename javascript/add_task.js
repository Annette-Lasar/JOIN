let allTasks = [];
let subTasks = [];
let taskCategories = ['Technical Task', 'User Story'];
let updatedSubtask;
let allCategories = [
  {
    category_name: 'Technical Task',
    category_color: '#FF0000',
  },

  {
    category_name: 'User Story',
    category_color: '#0000FF',
  },

  {
    category_name: 'Marketing',
    category_color: '#008000',
  },

  {
    category_name: 'Development',
    category_color: '#FFA500',
  },

  {
    category_name: 'Design',
    category_color: '#DA70D6',
  },

  {
    category_name: 'Leisure',
    category_color: '#90EE90',
  },
];

let allContacts = [
  {
    contact_first_name: 'Bilbo',
    contact_family_name: 'Beutlin',
    contact_color: '#FF0000',
  },

  {
    contact_first_name: 'Hermione',
    contact_family_name: 'Granger',
    contact_color: '#0000FF',
  },

  {
    contact_first_name: 'Donald',
    contact_family_name: 'Duck',
    contact_color: '#008000',
  },
];
let currentContacts = [];
let currentDueDates = [];
let currentCategories = [];

const TASK_TITLE_INFO_BOX = document.getElementById('task_title_info');
const TASK_DUE_INFO_BOX_SMALL = document.getElementById('task_due_info_small');
const TASK_DUE_INFO_BOX_BIG = document.getElementById('task_due_info_big');
const TASK_CATEGORY_BOX_SMALL = document.getElementById(
  'task_category_info_small'
);
const TASK_CATEGORY_BOX_BIG = document.getElementById('task_category_info_big');
const CONTACT_LIST_BOX = document.getElementById('contact_list');
const CATEGORY_LIST_SMALL = document.getElementById('category_list_small');
const CATEGORY_LIST_BIG = document.getElementById('category_list_big');
const SELECT_TASK_CATEGORY_ELEMENT_SMALL = document.getElementById(
  `task_category_text_small`
);
const SELECT_TASK_CATEGORY_ELEMENT_BIG = document.getElementById(
  `task_category_text_big`
);
const SUBTASK_CONTAINER_SMALL = document.getElementById(
  'subtask_container_small'
);
const SUBTASK_CONTAINER_BIG = document.getElementById('subtask_container_big');

function initTasks() {
  loadSubtasks();
  init();
  showAndHideBoxesAccordingToScreenSize();
  renderContacts();
  renderCategories();
  renderSubtasks();
}

/**
 * Toggles dropdown lists on add tasks page by displaying all available options
 * of the dropdown list and rotating the arrow 180 deg
 * Shows an option to add a new task category resp a new contact
 * @param {string} idContainer - represents the container that holds the list of options
 * @param {string} idArrow  - represents the img element with the arrow
 */
function toggleDropdownLists(idContainer, idArrow) {
  const CATEGORY_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_LIST.classList.toggle('show');
  SELECT_ARROW.classList.toggle('turn');
}

function showAndHideBoxesAccordingToScreenSize() {
  let prioSmallScreen = document.getElementById('prio_small_screen');
  let dueDateSmallScreen = document.getElementById('due_date_small_screen');
  let categorySmallScreen = document.getElementById('category_small_screen');
  let subTasksSmallScreen = document.getElementById('sub_tasks_small_screen');
  let bigScreen = document.getElementById('big_screen');
  let windowSize = window.innerWidth;

  if (windowSize < 800) {
    prioSmallScreen.classList.remove('d-none');
    dueDateSmallScreen.classList.remove('d-none');
    categorySmallScreen.classList.remove('d-none');
    subTasksSmallScreen.classList.remove('d-none');
    SUBTASK_CONTAINER_SMALL.classList.remove('d-none');
    bigScreen.classList.add('d-none');
  } else {
    prioSmallScreen.classList.add('d-none');
    dueDateSmallScreen.classList.add('d-none');
    categorySmallScreen.classList.add('d-none');
    subTasksSmallScreen.classList.add('d-none');
    SUBTASK_CONTAINER_SMALL.classList.add('d-none');
    bigScreen.classList.remove('d-none');
  }
}

/* function setAndRemoveAttributeRequired() {
  let InputDueDateSmallScreen = document.getElementById('task_due_date_small');
  let InputDueDateBigScreen = document.getElementById('task_due_date_big');
  let windowSize = window.innerWidth;
  if (windowSize < 800) {
    InputDueDateSmallScreen.setAttribute('required', '');
    InputDueDateBigScreen.removeAttribute('required', '');
  } else {
    InputDueDateSmallScreen.removeAttribute('required', '');
    InputDueDateBigScreen.setAttribute('required', '');
  }
}
 */
document.addEventListener('DOMContentLoaded', function () {
  showAndHideBoxesAccordingToScreenSize();
  /*   setAndRemoveAttributeRequired(); */
  window.addEventListener('resize', showAndHideBoxesAccordingToScreenSize);
  /* window.addEventListener('resize', setAndRemoveAttributeRequired); */
});

/* function checkForAddTaskPage() {
  let url = window.location.href;

  if (url.endsWith('add_task.html')) {
    document.addEventListener('DOMContentLoaded', function () {
      showAndHideBoxesAccordingToScreenSize();
      setAndRemoveAttributeRequired();
      window.addEventListener('resize', showAndHideBoxesAccordingToScreenSize);
      window.addEventListener('resize', setAndRemoveAttributeRequired);
    });
  }
} */

/* checkForAddTaskPage(); */

/* --------------------------------------------------------------------
contact section in add_task.html
---------------------------------------------------------------------- */
function renderContacts() {
  CONTACT_LIST_BOX.innerHTML = '';
  for (i = 0; i < allContacts.length; i++) {
    const oneContact = allContacts[i];
    CONTACT_LIST_BOX.innerHTML += generateContactListHTML(i, oneContact);
  }
}

function generateContactListHTML(i, oneContact) {
  return /* html */ `
    <li>
      <div class="initials-wrapper">
        <div class="initials-icon" style="background-color: ${oneContact.contact_color}">${oneContact.contact_first_name[0]}${oneContact.contact_family_name[0]}</div>
        <div>
        ${oneContact.contact_first_name} ${oneContact.contact_family_name}
        </div>
      </div>
      <div><input onclick="selectContacts()" type="checkbox"></div>
    </li>
  `;
}

/* function selectContacts() {
  let selectedContact = {
    category_name: currentCategoryName,
    category_color: currentCategoryColor,
  };

  
} */

function selectContacts(index) {
  const selectedContact = allContacts[index];

  // Überprüfen, ob der Kontakt bereits ausgewählt ist
  const isSelected = currentContacts.some(contact => contact === selectedContact);

  // Wenn nicht ausgewählt, füge den Kontakt hinzu; sonst entferne ihn
  if (!isSelected) {
    currentContacts.push(selectedContact);
  } else {
    const indexToRemove = currentContacts.indexOf(selectedContact);
    currentContacts.splice(indexToRemove, 1);
  }

  // Hier kannst du weitere Aktionen basierend auf den ausgewählten Kontakten durchführen
  console.log("Aktuelle ausgewählte Kontakte:", currentContacts);
}

/* --------------------------------------------------------------------
due date section in add_task.html
---------------------------------------------------------------------- */
/* function selectDueDate(containerId) {
  const duedateBox = document.getElementById(containerId);
  let currentDueDate = currentDueDates[0];
  const duedateBoxSmall = document.getElementById('task_due_date_small');
  const duedateBoxBig = document.getElementById('task_due_date_big');
  currentDueDate = duedateBox.value;

  console.log('Fälligkeitsdatum: ', currentDueDate);
  duedateBoxSmall.innerHTML = currentDueDate.value;
  duedateBoxBig.innerHTML = currentDueDate.value;
} */

/* --------------------------------------------------------------------
category section in add_task.html
---------------------------------------------------------------------- */
function renderCategories() {
  CATEGORY_LIST_SMALL.innerHTML = '';
  CATEGORY_LIST_BIG.innerHTML = '';
  let i;
  for (i = 0; i < allCategories.length; i++) {
    const currentCategory = allCategories[i];
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

function generateNewCategoryBoxHTML(i, containerType) {
  return /* html */ `
    <div id="new_category_${containerType}" class="new-category">
      <div>New category</div>
      <div id="new_category_plus_${containerType}" onclick="createNewCategory(${i}, '${containerType}')"><img src="../icons/plus.svg" alt=""></div>
    </div>
  `;
}

function generateCategoryListHTML(i, currentCategory, containerType) {
  return /* html */ `
        <li id="category_item_${containerType}_${i}" class="category-item">
          <div onclick="selectTaskCategory('${currentCategory.category_name}', '${currentCategory.category_color}')" class="icon-and-category-wrapper">
            <svg id="category_circle_icon_${containerType}_${i}" width="16" height="16">
            <circle cx="8" cy="8" r="6" fill="${currentCategory.category_color}" stroke="black" stroke-width="1"/>
            </svg>
            <div>
            ${currentCategory.category_name}
            </div>
          </div>
          <div class="category-icon-wrapper">
            <img onclick="editCategory(${i}, '${currentCategory.category_name}', '${currentCategory.category_color}', '${containerType}')" src="../icons/edit_dark.svg" height="14">
            <div class="subtask-separator-line"></div>
            <img onclick="deleteCategory(${i})" src="../icons/delete.svg" height="14">
          </div>
        </li>
    `;
}

function selectTaskCategory(currentCategoryName, currentCategoryColor) {
  let selectedCategory = {
    category_name: currentCategoryName,
    category_color: currentCategoryColor,
  };

  currentCategories[0] = selectedCategory;
  renderCurrentCategory();
  closeCategoryLists(`category_list_small`, `select_arrow_categories_small`);
  closeCategoryLists(`category_list_big`, `select_arrow_categories_big`);
}

/* function deleteCategory(i) {
  let categoryToBeDeleted = allCategories[i];
  console.log('Zu löschende Kategorie', categoryToBeDeleted);
  let currentCategory = currentCategories[0];
  console.log('Aktuelle Kategorie: ', currentCategory);
  allCategories.splice(i, 1);
  if (categoryToBeDeleted === currentCategory) {
    currentCategories.splice(0, 1);
    renderCurrentCategory();
  }
  renderCategories();
  closeCategoryLists(`category_list_small`, `select_arrow_categories_small`);
  closeCategoryLists(`category_list_big`, `select_arrow_categories_big`);
} */

function deleteCategory(i) {
  let categoryToBeDeleted = allCategories[i];
  let categoryIndex = currentCategories.findIndex(function (item) {
    return item.category_name === categoryToBeDeleted.category_name;
  });
  allCategories.splice(i, 1);
  if (categoryIndex === 0) {
    currentCategories.splice(categoryIndex, 1);
    renderCurrentCategory();
  }
  renderCategories();
  closeCategoryLists(`category_list_small`, `select_arrow_categories_small`);
  closeCategoryLists(`category_list_big`, `select_arrow_categories_big`);
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

function generateCurrentCategoryHTML(
  currentCategoryName,
  currentCategoryColor
) {
  return /* html */ `
     <div  class="task-category-text">
          <svg  width="16" height="16">
           <circle cx="8" cy="8" r="6" fill="${currentCategoryColor}" stroke="black" stroke-width="1"/>
          </svg>
            <div>
            ${currentCategoryName}
            </div>
     </div>
    `;
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

function generateCategoryInputHTML(
  i,
  currentCategoryName,
  currentCategoryColor,
  containerType
) {
  return /* html */ `
    <div class="icon-and-category-wrapper">
      <input id="color_input_${containerType}_${i}" type="color" value="${currentCategoryColor}">
      <input id="category_input_${containerType}_${i}" type="text" class="input-edit-category-text" value="${currentCategoryName}" required>
      <div class="close-and-check-wrapper-edit-subtask">
        <img onclick="renderCategories()" class="cancel-edit-subtask" src="../icons/close.svg" alt="">
        <div class="subtask-separator-line"></div>
        <img onclick="changeCategoryTextAndColor(${i}, '${containerType}')" class="check-edit-subtask" src="../icons/check.svg" alt="">
      </div>
    </div>
    
  `;
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
    allCategories[i] = updatedCategory;
    renderCategories();
  } else {
    alert("The input field mustn't be empty.");
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

function generateInputForNewCategoryHTML(i, containerType, randomColor) {
  return /* html */ `
    <input id="color_new_input_${containerType}_${i}" type="color" value="${randomColor}">
    <input id="category_new_input_${containerType}" type="text" class="category-new-input" placeholder="Pick color and add category">
    <div class="close-and-check-wrapper-edit-subtask">
        <img onclick="renderCategories()" class="cancel-edit-subtask" src="../icons/close.svg" alt="">
        <div class="subtask-separator-line"></div>
        <img onclick="addNewCategory(${i}, '${containerType}')" class="check-edit-subtask" src="../icons/check.svg" alt="">
      </div>
  `;
}

function addNewCategory(i, containerType) {
  let newCategoryColor = document.getElementById(
    `color_new_input_${containerType}_${i}`
  );
  let newCategoryText = document.getElementById(
    `category_new_input_${containerType}`
  );
  if (newCategoryText.value !== '') {
    let newCategory = {
      category_name: newCategoryText.value.trim(),
      category_color: newCategoryColor.value,
    };
    allCategories.push(newCategory);
    renderCategories();
  } else {
    alert("The input field mustn't be empty.");
    renderCategories();
  }
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
  saveSubtasks();
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
    subTasks.push(SUBTASK_INPUT_BOX.value);
  } else {
    alert('Bitte geben Sie Text ein.');
  }
  saveSubtasks();
  renderSubtasks();
  SUBTASK_INPUT_BOX.value = '';
  hideCancelAndAcceptSubtask(CLOSE_AND_CHECK_WRAPPER, SUBTASK_PLUS_ICON);
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
 * With this function the html code for rendering the subtask is generated.
 * @param {integer} i - Index of the current task.
 * @param {string} subtask - Value/ text of the current task
 * @param {string} containerType - Container type ('small' or 'big') according to
 * whether the user is working in a small or wide viewport
 * @returns
 */
function generateSubtaskHTML(i, subtask, containerType) {
  return /* html */ `
      <div id="subtask_list_wrapper_${containerType}_${i}" class="subtask-list-${containerType}">${subtask}
        <div class="subtask-button-wrapper-${containerType}">
          <img onclick="editSubtask(${i}, '${containerType}', '${subtask}')" src="../icons/edit_dark.svg">
          <div class="subtask-separator-line"></div>
          <img onclick="deleteSubtask(${i})" src="../icons/delete.svg">
        </div>
      </div>
  `;
}

/**
 * This function saves the added subtasks in the local storage.
 */
function saveSubtasks() {
  let subtasksAsText = JSON.stringify(subTasks);
  localStorage.setItem('Subtasks', subtasksAsText);
}

/**
 * This function loads the subtasks from the local storage and transfers
 * them back into the array subTasks.
 */
function loadSubtasks() {
  let subtasksAsText = localStorage.getItem('Subtasks');
  if (subtasksAsText) {
    subTasks = JSON.parse(subtasksAsText);
  }
  renderSubtasks();
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
 * This function generates an input field that contains the text of the former
 * subtask and two buttons (x and accept) which are separated by a vertical line.
 * @param {integer} i - index of the current subtask
 * @param {string} containerType - 'small' or 'big' according to the viewport size
 * @param {string} subtask - text of the current subtask
 * @returns
 */
function generateInputEditHTML(i, containerType, subtask) {
  return /* html */ `
    <div class="edit-subtask-wrapper">
      <input type="text" id="edit_input_${containerType}_${i}" value="${subtask}" class="edit-input" placeholder="Enter your edited subtask text">
      <div class="close-and-check-wrapper-edit-subtask">
        <img onclick="renderSubtasks()" class="cancel-edit-subtask" src="../icons/close.svg" alt="">
        <div class="subtask-separator-line"></div>
        <img onclick="changeSubtaskText(${i}, '${containerType}', '${subtask}')" class="check-edit-subtask" src="../icons/check.svg" alt="">
      </div>
    </div>
  `;
}

function changeSubtaskText(i, containerType) {
  let editedInput = document.getElementById(`edit_input_${containerType}_${i}`);
  let editedSubtask = editedInput.value.trim();
  if (editedSubtask !== '') {
    subTasks[i] = editedSubtask;
    saveSubtasks();
    renderSubtasks();
  } else {
    alert("The input field mustn't be empty.");
    renderSubtasks();
  }
}

function createNewTask() {
  const titleBox = document.getElementById('task_title');
  const descriptionBox = document.getElementById('task_description');
  let inputFields = document.querySelectorAll('input');
  if (titleBox.value === '' || currentCategories.length === 0) {
    if (titleBox.value === '') {
      TASK_TITLE_INFO_BOX.classList.add('visible');
      inputFields[0].classList.add('red-border');
    }
    if (currentCategories.length === 0) {
      TASK_CATEGORY_BOX_SMALL.classList.add('visible');
      TASK_CATEGORY_BOX_BIG.classList.add('visible');
    }
  } else {
    let task = {
      title: titleBox.value,
      description: descriptionBox.value,
      current_category: currentCategories,
      subtasks: subTasks,
    };
    allTasks.push(task);
    console.log('Aufgaben: ', allTasks);
    TASK_TITLE_INFO_BOX.classList.remove('visible');
    inputFields[0].classList.remove('red-border');
    TASK_CATEGORY_BOX_SMALL.classList.remove('visible');
    TASK_CATEGORY_BOX_BIG.classList.remove('visible');
  }
}
