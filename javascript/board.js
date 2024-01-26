/**
 * This function executes all other functions that need to be
 * executed on loading the page.
 */
async function initBoard() {
  await loadTasksUserOrGuest();
  await loadContactsUserOrGuest();
  await loadCategoriesUserOrGuest();
  showTasksOnBoard();
}


/**
 * This function can clear several containers in one go.
 * @param  {...string} containerIDs - These are the ids of the containers to be cleared.
 */
function clearContainers(...containerIDs) {
  containerIDs.forEach(function (id) {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = '';
    }
  });
}


/**
 * This function iterates through the array tasks in order to display them on the board.
 */
function showTasksOnBoard() {
  clearContainers('toDo', 'inProgress', 'awaitFeedback', 'done');
  for (let i = 0; i < tasks.length; i++) {
    const oneTask = tasks[i];
    let status = oneTask.status;
    callFurtherFunctionsToRenderTasks(i, oneTask, status);
  }
}

/**
 * This function sorts the tasks to the lists that match their status.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {Object} oneTask - This is a JSON representing one task in the array tasks.
 * @param {string} status - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 */
function renderTasksOnBoard(i, oneTask, status) {
  const newTruncatedSentence = truncateSentence(oneTask.description, 6);
  const completedSubtasksInPercent = calculateSubtaskPercentage(i, oneTask);
  const listStatus = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
  listStatus.forEach((targetStatus) => {
    const tasksWithTargetStatus = tasks.filter(
      (task) => task.status === targetStatus
    );
    renderTaskList(targetStatus, tasksWithTargetStatus);
    if (status === targetStatus) {
      document.getElementById(status).innerHTML += generateToDoHTML(
        i,
        oneTask,
        newTruncatedSentence,
        completedSubtasksInPercent
      );
    }
  });
}

/**
 * This function renders the task to their lists.
 * @param {string} targetStatus - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 * @param {Array} tasksWithTargetStatus - This is an array that contains all tasks with
 * the same status.
 */
function renderTaskList(targetStatus, tasksWithTargetStatus) {
  const listElement = document.getElementById(targetStatus);
  if (tasksWithTargetStatus.length === 0) {
    listElement.innerHTML = `<div class="empty-list-message">No tasks ${replaceStatusText(
      targetStatus
    )}</div>`;
  }
}

/**
 * This function replaces the status names by readable names.
 * @param {string} status - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 * @returns It returns a readable version of a task's current status.
 */
function replaceStatusText(status) {
  switch (status) {
    case 'toDo':
      return 'to Do';
    case 'inProgress':
      return 'in Progress';
    case 'awaitFeedback':
      return 'await Feedback';
    default:
      return status;
  }
}

/**
 * This functions calls other functions that determine a task's design.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {Object} oneTask - This is a JSON representing a task in the array tasks.
 * @param {string} status This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 */
function callFurtherFunctionsToRenderTasks(i, oneTask, status) {
  renderTasksOnBoard(i, oneTask, status);
  updateProgressBar(i, tasks[i]);
  updateCompletedTasks(i, tasks[i]);
  renderContactsOnOutsideCard(i, oneTask);
}

/**
 * This function truncates a task description's text after the first six words
 * and replaces the rest by three dots (...) to be shown on the outside of a task card.
 * @param {string} sentence - This is a task's description text.
 * @param {number} wordsCount - This is the number of words of the description text 
 * that shall be shown on the outside of a task card.
 * @returns This function returns a truncated sentences if the description is equal to
 * or longer than 6 words. 
 */
function truncateSentence(sentence, wordsCount) {
  const words = sentence.split(' ');
  if (words.length <= wordsCount) {
    return sentence;
  } else {
    const truncatedSentence = words.slice(0, wordsCount).join(' ') + ' ...';
    return truncatedSentence;
  }
}

/**
 * This function calculates the percentage of the completed subtasks in relation to
 * the total number of the subtasks.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {Object} oneTask - This is a JSON that represents a task in the array tasks.
 * @returns 
 */
function calculateSubtaskPercentage(i, oneTask) {
  if (oneTask.subtasks.length > 0) {
    return (tasks[i].completed_subtasks / oneTask.subtasks.length) * 100;
  } else {
    return 0;
  }
}

/**
 * This function updates the progress bar on a task card when changes to the number
 * of completed subtasks or the total number of subtasks have been made.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {Object} oneTask - This is a JSON representing one task in the array tasks.
 */
async function updateProgressBarAndCompletedTasks(i, oneTask) {
  updateProgressBar(i, oneTask);
  updateCompletedTasks(i, oneTask);
  checkForCurrentSubtaskStatus(i);
  await sendTasksToServer();
  await loadTasksUserOrGuest();
  await loadContactsUserOrGuest();
  showTasksOnBoard();
}

/**
 * This function updates the length of the colored part of the progress bar according
 * to how many subtasks have been completed in relation to the total number of subtasks.
 * @param {number} i - This is the index of a task in the array tasks. 
 * @param {Object} oneTask - This is a JSON representing a task in the array tasks.
 */
function updateProgressBar(i, oneTask) {
  const progressBarWrapper = document.getElementById(`progress_wrapper_${i}`);
  const progressBar = document.getElementById(`progress_bar_${i}`);
  let completedSubtasksInPercent = calculateSubtaskPercentage(i, oneTask);
  if (oneTask.subtasks.length > 0) {
    progressBar.value = completedSubtasksInPercent;
  } else {
    progressBarWrapper.classList.add('d-none');
  }
}

/**
 * This function updates the number of completed subtasks in relation to the total number
 * of subtasks.
 * @param {number} i - This is the index of a task in the array tasks. 
 * @param {Object} oneTask - This is a JSON representing a task in the array task.
 */
function updateCompletedTasks(i, oneTask) {
  const completedSubtasksBox = document.getElementById(
    `label_for_progress_bar_${i}`
  );
  completedSubtasksBox.innerHTML = `${oneTask.completed_subtasks}/${oneTask.subtasks.length} Subtasks`;
}

/**
 * This function renders the contacts assigned to a task in form of little icons containing
 * a contact's initials.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {Object} oneTask - This is a JSON representing a task in the array tasks.
 */
function renderContactsOnOutsideCard(i, oneTask) {
  const taskContactContainer = document.getElementById(`task_contact_${i}`);
  taskContactContainer.innerHTML = '';
  if (oneTask.current_contacts.length <= 0) {
    taskContactContainer.innerHTML =
      '<div class="not-assigned">No contacts assigned</>';
  } else {
    calculateNumberOfVisibleContacts(i, oneTask, taskContactContainer);
  }
}

/**
 * This function calculates the number of contact icons that fit into the container
 * on the outside of a task card.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {Object} oneTask - This is a JSON representing a task in the array tasks.
 * @param {HTMLElement} taskContactContainer - This is the container in which the 
 * contact icons are displayed.
 */
function calculateNumberOfVisibleContacts(i, oneTask, taskContactContainer) {
  const maxWidth = taskContactContainer.offsetWidth;
  let visibleContacts = oneTask.current_contacts.slice();
  let hiddenContactsCount = 0;
  while (
    calculateTotalWidthOfContacts(visibleContacts) > maxWidth &&
    visibleContacts.length > 1
  ) {
    hiddenContactsCount++;
    visibleContacts.pop();
  }
  showVisibleContactsAndOverflowIndicator(i, visibleContacts, hiddenContactsCount, taskContactContainer);
}

/**
 * This function shows the visible contacts and an overflow indicator on the outside
 * of a task card.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {number} visibleContacts - This is the number of contact icons that fit into
 * the container in which they are to be displayed.
 * @param {number} hiddenContactsCount - This is the number of contact icons that don't
 * fit into the container. 
 * @param {HTMLElement} taskContactContainer - This is the container in which the contact
 * icons are to be displayed.
 */
function showVisibleContactsAndOverflowIndicator(
  i,
  visibleContacts,
  hiddenContactsCount,
  taskContactContainer
) {
  for (let j = 0; j < visibleContacts.length; j++) {
    const oneContact = visibleContacts[j];
    taskContactContainer.innerHTML += generateTaskContactHTML(i, j, oneContact);
    adaptInitialsToBackground(`initials_icons_outside_card_${i}_${j}`);
  }
  if (hiddenContactsCount > 0) {
    const overflowIndicatorHTML =
      generateOverflowIndicatorOutsideCardHTML(hiddenContactsCount);
    taskContactContainer.innerHTML += overflowIndicatorHTML;
  }
}

/**
 * This function calculates the total width of all contact Icons and of the 
 * overflow indicator.
 * @param {Array} contacts - This is a temporary array of all visible contacts.
 * @returns - The function returns a number that indicates how much space 
 * all contact icons and the overflow indicator will take.
 */
function calculateTotalWidthOfContacts(contacts) {
  const contactWidth = 25;
  return contacts.length * contactWidth + contactWidth;
}

/**
 * This function renders all contacts assigned to a task in the detailed view
 * of a card. 
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {Object} oneTask - This is a JSON representing one task in the array tasks.
 */
function renderContactsInsideCard(i, oneTask) {
  const detailTaskContactNameContainer = document.getElementById(
    `detail_contacts_name_${i}`
  );
  detailTaskContactNameContainer.innerHTML = '';
  for (let j = 0; j < oneTask.current_contacts.length; j++) {
    const oneContact = oneTask.current_contacts[j];
    detailTaskContactNameContainer.innerHTML +=
      generateDetailTaskContactNamesHTML(i, j, oneContact);
    adaptInitialsToBackground(`detail_view_initials_icon_${i}_${j}`);
  }
}

/**
 * This event listener checks if the window size changes and rerenders 
 * the tasks on the board.
 */
window.addEventListener('resize', function () {
  const url = window.location.href;
  if (url.endsWith('board.html')) {
    showTasksOnBoard();
  }
});

/**
 * This function gets a task's current due date in order to reformat it.
 * @param {number} i - This is the index of a task in the array tasks. 
 * @param {Object} oneTask - This is a JSON representing one task in the array tasks.
 */
function getFilteredDueDate(i, oneTask) {
  const dueDateContainer = document.getElementById(`current_due_date_${i}`);
  dueDateContainer.innerHTML = '';
  let inputDate = oneTask.current_due_date;
  let currentDueDate = formatDateString(inputDate);
  dueDateContainer.innerHTML = generateDueDateForDetailViewHTML(currentDueDate);
}

/**
 * This function reformats the current due date of a task according to the pattern
 * of dd/mm/yyyy.
 * @param {Date} inputDate - This is the current due date.
 * @returns - The function returns the current due date in the new format.
 */
function formatDateString(inputDate) {
  const inputDateObject = new Date(inputDate);
  const day = inputDateObject.getDate();
  const month = inputDateObject.getMonth() + 1;
  const year = inputDateObject.getFullYear();
  const formattedDay = day < 10 ? '0' + day : day;
  const formattedMonth = month < 10 ? '0' + month : month;
  return `${formattedDay}/${formattedMonth}/${year}`;
}

/**
 * This function renders the subtasks in the detailed view.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {Object} oneTask - This is a JSON representing one task in the array tasks.
 */
function renderSubtasksDetailView(i, oneTask) {
  const subtaskContainer = document.getElementById(
    `detail_subtasks_wrapper_${i}`
  );
  subtaskContainer.innerHTML = '';
  for (let j = 0; j < oneTask.subtasks.length; j++) {
    const oneSubtask = oneTask.subtasks[j];
    subtaskContainer.innerHTML += generateSubtasksDetailViewHTML(
      i,
      j,
      oneSubtask
    );
  }
}

/**
 * This function checks how many subtasks have been completed.
 * @param {number} j - This is the index of a subtask in the subarray subtasks.
 * @param {Object} oneTask - This is a JSON representing one task in the array tasks.
 * @param {HTMLElement} individualSubtaskCheckbox - This is the checkbox that is rendered
 * next to each task's subtask.
 */
function checkForCompletedSubtasks(j, oneTask, individualSubtaskCheckbox) {
  let finallyCompletedSubtasks;
  if (individualSubtaskCheckbox.checked == true) {
    finallyCompletedSubtasks = oneTask.completed_subtasks + 1;
    oneTask.subtasks[j].checked_status = true;
  } else {
    finallyCompletedSubtasks = oneTask.completed_subtasks - 1;
    oneTask.subtasks[j].checked_status = false;
  }
  oneTask.completed_subtasks = finallyCompletedSubtasks;
}

/**
 * This function marks the checked subtasks accordingly in the detailed view of a task.
 * @param {string} checkedStatus - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 * @param {HTMLElement} individualSubtaskCheckbox - This is the checkbox that is rendered 
 * next to each task's subtask.
 */
function markCheckboxesAccordingToStatus(
  checkedStatus,
  individualSubtaskCheckbox
) {
  if (checkedStatus == true) {
    individualSubtaskCheckbox.checked = true;
  } else {
    individualSubtaskCheckbox.checked = false;
  }
}

/**
 * This function closes a dropdown list if the user clicks outside the list.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {MouseEvent} event - This is a click event.
 */
function clickOutsideDropdown(i, event) {
  const clickedElement = event.target.closest('.contact-list-element');
  if (clickedElement == null) {
    closeDropdownList(
      `edit_contact_list${i}`,
      `select_arrow_contacts${i}`,
      event
    );
  }
}

/**
 * This function caches a dragged element's id in an array to be used later.
 * @param {string} id - A dragged element's id. 
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * This function moves a tasks card into another list on the kanban board.
 * @param {string} status - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 */
async function moveTo(status) {
  tasks[currentDraggedElement].status = '';
  tasks[currentDraggedElement].status = status;
  sendTasksToServer();
  await loadTasksUserOrGuest();
  await loadContactsUserOrGuest();
  showTasksOnBoard();
}

/**
 * This function moves a task card to a new list by clicking on a card's context menu.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {string} status - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 * @param {MouseEvent} event - This is a click event. It's needed to stop event bubbling.
 */
function moveToNewList(i, status, event) {
  event.stopPropagation();
  currentTaskCard = document.getElementById(`taskCard_${i}`);
  let cardStatus = tasks[i].status;
  if (status !== cardStatus) {
    tasks[i].status = status;
    showTasksOnBoard();
  }
}

/**
 * This function deletes a task completely. The user gets a warning for this process
 * is irreversible.
 * @param {number} i - This is the index of a task in the array tasks.
 */
async function deleteTask(i) {
  tasks.splice(i, 1);
  openOrCloseAlertContainer('confirm_container', 'close');
  await sendTasksToServer();
  await loadTasksUserOrGuest();
  await loadContactsUserOrGuest();
  showTasksOnBoard();
}

/**
 * This function removes the highlight from a dragging area on the board
 * after the dragging process is over.
 * @param {string} id - This is the dragging area's id.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * This function drops a card into the new list on the board.
 * @param {event} ev - This is used to prevent default reaction.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * This function is used to highlight a dragging area.
 * @param {string} id - This is the dragging area's id.
 */
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * This function opens a card's context menu by clicking on three dots
 * in the top right corner of a card. The context menu enables the user
 * to move the clicked card into another list.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {string} status - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 * @param {MouseEvent} event - This is a click event. 
 */
function openCardContextMenu(i, status, event) {
  event.stopPropagation();
  const cardMenuContainer = document.getElementById(`context_menu_${i}`);
  const listItemInfo = getListItemInfo();
  for (const listStatus of Object.keys(listItemInfo)) {
    const listItemElement = document.getElementById(`${listStatus}_${i}`);
    if (status === listStatus) {
      listItemElement.style.pointerEvents = 'none';
      listItemElement.style.color = '#d6d6d6';
    }
  }
  cardMenuContainer.classList.remove('d-none');
}

/**
 * This function gets the lists' ids for moving a card to another list.
 * @returns It returns a JSON with the list ids.
 */
function getListItemInfo() {
  let listIds = {
    toDo: 1,
    inProgress: 2,
    awaitFeedback: 3,
    done: 4,
  };
  return listIds;
}

/**
 * This function closes the card context menu.
 * @param {number} i - This is the index of a task in the array tasks. 
 * @param {MouseEvent} event - This is a click event.
 */
function closeCardContextMenu(i, event) {
  event.stopPropagation();
  const contextMenuContainer = document.getElementById(`context_menu_${i}`);
  contextMenuContainer.classList.add('d-none');
}


/**
 * This function opens or closes a container with the task index, the container id
 * and the action given as parameters.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {string} containerId - This is the id of the container to be opened or closed.
 * @param {string} action - This is the action to be executed, either 'open' or 'close'.
 */
function openOrCloseContainer(i, containerId, action) {
  const cardMenuContainer = document.getElementById(containerId);
  if (action === 'open') {
    cardMenuContainer.classList.remove('d-none');
    renderTaskDetailView(i);
    checkForCurrentSubtaskStatus(i);
    updateProgressBar(i, tasks[i]);
    updateCompletedTasks(i, tasks[i]);
    document.body.style.overflow = 'hidden';
  } else if (action === 'close') {
    const editTaskWrapper = document.getElementById(`edit_task_wrapper${i}`);
    editTaskWrapper.classList.remove('edit-task-wrapper');
    cardMenuContainer.classList.add('d-none');
    updateProgressBarAndCompletedTasks(i, tasks[i]);
    document.body.style.overflow = 'visible';
  }
}

/**
 * This function checks if a subtask has already been completed or not.
 * @param {number} i - This is the index of a task in the array tasks.
 */
function checkForCurrentSubtaskStatus(i) {
  const subtasks = tasks[i].subtasks;
  for (let j = 0; j < subtasks.length; j++) {
    const oneSubtask = subtasks[j];
    const individualCheckBox = document.getElementById(
      `individual_subtask_checkbox_${i}_${j}`
    );
    if (oneSubtask.checked_status) {
      individualCheckBox.checked = true;
    } else {
      individualCheckBox.checked = false;
    }
  }
}

/**
 * This function renders a detail view of a task.
 * @param {number} i - This is the index of a task in the array tasks.
 */
function renderTaskDetailView(i) {
  const cardDetailContainer = document.getElementById(
    `detail_task_wrapper_${i}`
  );
  cardDetailContainer.innerHTML = generateDetailViewHTML(i, tasks[i]);
  renderContactsInsideCard(i, tasks[i]);
  renderSubtasksDetailView(i, tasks[i]);
  checkForCurrentSubtaskStatus(i);
  getFilteredDueDate(i, tasks[i]);
}

/**
 * This function opens an overlay container which enables the user to 
 * create a new task directly in the list that was clicked.
 * @param {string} status - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 */
function openAddTaskToList(status) {
  const addTaskOverlayContainer = document.getElementById('add_task_overlay');
  addTaskOverlayContainer.classList.remove('d-none');
  showAndHideBoxesAccordingToScreenSize();
  renderCategories();
  renderContacts();
  addCheckboxEventListeners();
  setStandardDateToToday('task_due_date_small');
  setStandardDateToToday('task_due_date_big');
  renderCreateTaskButtons(status);
}

/**
 * This function renders two create task-buttons in order to clear all input
 * fields or to create a new task.
 * @param {string} status - This is a task's status like 'toDo', 'inProgress',
 * 'awaitFeedback' or 'done'.
 */
function renderCreateTaskButtons(status) {
  const createTaskWrapper = document.getElementById('create_task_wrapper');
  createTaskWrapper.innerHTML = generateCreateTaskButtonsHTML(status);
}

/**
 * This function closes the overlay that adds a new task to a certain list
 */
function closeAddTaskToList() {
  const addTaskOverlayContainer = document.getElementById('add_task_overlay');
  addTaskOverlayContainer.classList.add('d-none');
}
