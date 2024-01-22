async function initTasks() {
  init();
  await checkIfUserIsLoggedIn('getFromServer');
  showAndHideBoxesAccordingToScreenSize();
  setStandardDateToToday('task_due_date_small');
  setStandardDateToToday('task_due_date_big');
  await loadContactsAndCategoriesUserOrGuest();     // Hier wird die funktion von Semir aufgerufen!!!!
  renderContacts();
  renderCurrentContacts();
  addCheckboxEventListeners();
  renderCategories();
  renderSubtasks();
}




/* --------------------------------------------------------------------
contact section in add_task.html
---------------------------------------------------------------------- */

//#################### Funktion von Semir START ################################

async function loadContactsAndCategoriesUserOrGuest() {
  let userLogin = localStorage.getItem('userLogin');
  if (userLogin == 'true') {
      let userEmail = localStorage.getItem('userEmail');
      userEmail = userEmail.replace(/"/g, '');
      users = JSON.parse(await getItem('users'));
      let user = users.find((u) => u.email === userEmail);
      if (user) {
          allContacts = JSON.parse(await getItem(`${user.email}_contacts`));            //  Hier wird das Kontakte-Array eines angemeldeten Users in der Variable 'allContacts' gespeichert
          // allCategories = JSON.parse(await getItem(`${user.email}_categories`));        //  Hier wird das Categories-Array eines angemeldeten Users in der Variable 'allCategories' gespeichert
      }
  } else {
      allContacts = JSON.parse(await getItem('guestContacts'));                          //   Hier wird das Kontakte-Array eines Gasts in der Variable 'allContacts' gespeichert
      allCategories = JSON.parse(await getItem(`guestCategories`));                       //   Hier wird das Categories-Array eines Gasts in der Variable 'allCategories' gespeichert
  }
}

//#################### Funktion von Semir ENDE ################################


/* --------------------------------------------------------------------
prio section in add_task.html
---------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------
due date section in add_task.html
---------------------------------------------------------------------- */
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
/* --------------------------------------------------------------------
category section in add_task.html
---------------------------------------------------------------------- */

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
    }
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

/* ---------------------------------------------------------------
create new task section in add_task.html
------------------------------------------------------------------- */
async function createNewTask() {
  createdTasks = [];
  checkIfBoxesAreEmpty();
  await sendCreatedTask();
}

function checkIfBoxesAreEmpty() {
  if (checkAllRequiredBoxes()) {
    checkIfTitleIsEmpty();
    checkIfDueDateIsEmpty();
    checkIfCategoriesIsEmpty();
  } else {
    let task = createTaskObject();
    createdTasks.push(task);
    taskId = task.id + 1;
    removeClassLists();
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

function createTaskObject() {
  let newTask = {
    title: TITLE_BOX.value,
    description: DESCRIPTION_BOX.value,
    current_prio: currentPrio,
    current_due_date: currentDueDate,
    current_contacts: currentContacts,
    current_category: currentCategories,
    subtasks: subTasks,
    completed_subtasks: 0,
    status: 'toDo',
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

/* ---------------------------------------------------------------
send task to server section in add_task.html
------------------------------------------------------------------- */
async function sendCreatedTask() {
  await checkIfUserIsLoggedIn('getFromServer');
  await checkIfUserIsLoggedIn('sendToServer');
}


async function checkIfUserIsLoggedIn(action) {
  let userLogin = localStorage.getItem('userLogin');
  if (userLogin == 'true') {
    let userEmail = localStorage.getItem('userEmail');
    userEmail = userEmail.replace(/"/g, '');
    users = JSON.parse(await getItem('users'));
    let user = users.find((u) => u.email == userEmail);
    if (action === 'getFromServer') {
      await getTasksFromServer(user);
    } else if (action === 'sendToServer') {
      await sendNewTaskToServer(user);
    }
  } else {
    if (action === 'getFromServer') {
      await getTasksFromServer('guest');
    } else if (action === 'sendToServer') {
      await sendNewTaskToServer('guest');
    }
  }
}

async function getTasksFromServer(user) {
  if (user !== 'guest') {
    tasks = JSON.parse(await getItem(`${user.email}_tasks`));
    tasks.forEach((oneTask) => createdTasks.push(oneTask));
  } else if (user === 'guest') {
    tasks = JSON.parse(await getItem('guestTasks'));
    tasks.forEach((oneTask) => createdTasks.push(oneTask));
    console.log('tasks', tasks);
  }
}

async function sendNewTaskToServer(user) {
  if (createdTasks.length > 0) {
    if (user === 'guest') {
      await setItem('guestTasks', JSON.stringify(createdTasks));
      clearAllTaskContainers();
      renderAlert(
        'alert_container',
        'alert_content',
        'A new task has successfully been created and added to the board.'
      );
    } else {
      await setItem(`${user.email}_tasks`, JSON.stringify(createdTasks));
      clearAllTaskContainers();
      renderAlert(
        'alert_container',
        'alert_content',
        'A new task has successfully been created and added to your board.'
      );
    }
  }
}
