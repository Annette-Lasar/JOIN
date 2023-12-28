let subTasks = [];
let taskCategories = ['Technical Task', 'User Story'];
let updatedSubtask;
let containerIndex = 0;
const SUBTASK_CONTAINER_SMALL = document.getElementById(
  'subtask_container_small'
);
const SUBTASK_CONTAINER_BIG = document.getElementById('subtask_container_big');

function initTasks() {
  loadSubtasks();
  init();
  showAndHideBoxesAccordingToScreenSize();
  checkforAddTaskPage();
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
  const CATEGORY_List = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_List.classList.toggle('show');
  SELECT_ARROW.classList.toggle('turn');
}

function showAndHideBoxesAccordingToScreenSize() {
  let prioSmallScreen = document.getElementById('prio_small_screen');
  let dueDateSmallScreen = document.getElementById('due_date_small_screen');
  let categorySmallScreen = document.getElementById('category_small_screen');
  let subTasksSmallScreen = document.getElementById('sub_tasks_small_screen');
  let bigScreen = document.getElementById('form_big_screen');
  let windowSize = window.innerWidth;

  if (windowSize < 800) {
    prioSmallScreen.style.display = 'block';
    dueDateSmallScreen.style.display = 'flex';
    categorySmallScreen.style.display = 'block';
    subTasksSmallScreen.style.display = 'flex';
    SUBTASK_CONTAINER_SMALL.style.display = 'block';
    bigScreen.style.display = 'none';
  } else {
    prioSmallScreen.style.display = 'none';
    dueDateSmallScreen.style.display = 'none';
    categorySmallScreen.style.display = 'none';
    subTasksSmallScreen.style.display = 'none';
    SUBTASK_CONTAINER_SMALL.style.display = 'none';
    bigScreen.style.display = 'block';
  }
}

function checkforAddTaskPage() {
  let url = window.location.href;

  if (url.endsWith('add_task.html')) {
    document.addEventListener('DOMContentLoaded', function () {
      showAndHideBoxesAccordingToScreenSize(); // Initial check
      window.addEventListener('resize', showAndHideBoxesAccordingToScreenSize);
    });
  }
}

checkforAddTaskPage();

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
    console.log('Subtask-Array: ', subTasks);
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
    alert('Das Eingabefeld darf nicht leer sein.');
    renderSubtasks();
  }
}
