async function initBoard() {
  await loadTasksUserOrGuest();
  showTasksOnBoard();
}

async function loadTasksUserOrGuest() {
  let userLogin = localStorage.getItem('userLogin');
  if (userLogin == 'true') {
    let userEmail = localStorage.getItem('userEmail');
    userEmail = userEmail.replace(/"/g, '');
    users = JSON.parse(await getItem('users'));
    let user = users.find((u) => u.email === userEmail);
    if (user) {
      tasks = JSON.parse(await getItem(`${user.email}_tasks`));
      contacts = JSON.parse(await getItem(`${user.email}_contacts`));
      categories = JSON.parse(await getItem(`${user.email}_categories`));
    }
  } else {
    tasks = JSON.parse(await getItem('guestTasks'));
    contacts = JSON.parse(await getItem('guestContacts'));
    categories = JSON.parse(await getItem('guestCategories'));
  }
}

function clearContainers(...containerIDs) {
  containerIDs.forEach(function (id) {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = '';
    }
  });
}

function showTasksOnBoard() {
  clearContainers('toDo', 'inProgress', 'awaitFeedback', 'done');
  for (let i = 0; i < tasks.length; i++) {
    const oneTask = tasks[i];
    let status = oneTask.status;
    callFurtherFunctionsToRenderTasks(i, oneTask, status);
  }
}

function renderTasksOnBoard(i, oneTask, status) {
  let newTruncatedSentence = truncateSentence(oneTask.description, 6);
  let completedSubtasksInPercent = calculateSubtaskPercentage(i, oneTask);
  const listStatus = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
  listStatus.forEach((targetStatus) => {
    const tasksWithTargetStatus = tasks.filter(
      (task) => task.status === targetStatus
    );
    if (tasksWithTargetStatus.length === 0) {
      document.getElementById(
        targetStatus
      ).innerHTML = `<div class="empty-list-message">No tasks ${replaceStatusText(
        targetStatus
      )}</div>`;
    } else if (status === targetStatus) {
      document.getElementById(status).innerHTML += generateToDoHTML(
        i,
        oneTask,
        newTruncatedSentence,
        completedSubtasksInPercent
      );
    }
  });
}

function replaceStatusText(status) {
  switch (status) {
    case 'toDo':
      return 'To Do';
    case 'inProgress':
      return 'In Progress';
    case 'awaitFeedback':
      return 'Await Feedback';
    default:
      return status;
  }
}

function callFurtherFunctionsToRenderTasks(i, oneTask, status) {
  renderTasksOnBoard(i, oneTask, status);
  updateProgressBar(i, tasks[i]);
  updateCompletedTasks(i, tasks[i]);
  renderContactsOnOutsideCard(i, oneTask);
}

function truncateSentence(sentence, wordsCount) {
  const words = sentence.split(' ');
  if (words.length <= wordsCount) {
    return sentence;
  } else {
    const truncatedSentence = words.slice(0, wordsCount).join(' ') + ' ...';
    return truncatedSentence;
  }
}

function calculateSubtaskPercentage(i, oneTask) {
  if (oneTask.subtasks.length > 0) {
    return (tasks[i].completed_subtasks / oneTask.subtasks.length) * 100;
  } else {
    return 0;
  }
}

async function updateProgressBarAndCompletedTasks(i, oneTask) {
  updateProgressBar(i, oneTask);
  updateCompletedTasks(i, oneTask);
  checkForCurrentSubtaskStatus(i);
  await sendDataToServer();
  await loadTasksUserOrGuest();
  showTasksOnBoard();
}

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

function updateCompletedTasks(i, oneTask) {
  const completedSubtasksBox = document.getElementById(
    `label_for_progress_bar_${i}`
  );
  completedSubtasksBox.innerHTML = `${oneTask.completed_subtasks}/${oneTask.subtasks.length} Subtasks`;
}

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
  showVisibleContactsAndOverflowIndicator(
    i,
    visibleContacts,
    hiddenContactsCount,
    taskContactContainer
  );
}

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

function calculateTotalWidthOfContacts(contacts) {
  const contactWidth = 25;
  return contacts.length * contactWidth + contactWidth;
}

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

window.addEventListener('resize', function () {
  const url = window.location.href;
  if (url.endsWith('board.html')) {
    showTasksOnBoard();
  }
});


function getFilteredDueDate(i, oneTask) {
  const dueDateContainer = document.getElementById(`current_due_date_${i}`);
  dueDateContainer.innerHTML = '';
  let inputDate = oneTask.current_due_date;
  let currentDueDate = formatDateString(inputDate);
  dueDateContainer.innerHTML = generateDueDateForDetailViewHTML(currentDueDate);
}



function formatDateString(inputDate) {
  const inputDateObject = new Date(inputDate);
  const day = inputDateObject.getDate();
  const month = inputDateObject.getMonth() + 1;
  const year = inputDateObject.getFullYear();
  const formattedDay = day < 10 ? '0' + day : day;
  const formattedMonth = month < 10 ? '0' + month : month;
  return `${formattedDay}/${formattedMonth}/${year}`;
}

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

function startDragging(id) {
  currentDraggedElement = id;
}

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

// status ist entweder 'toDo', 'inProgress', 'awaitFeedback' oder 'done' (siehe board.html)
// Status der Task wird geändert und das Array 'tasks' wird wieder auf den Server hochgeladen
async function moveTo(status) {
  tasks[currentDraggedElement].status = '';
  tasks[currentDraggedElement].status = status;
  sendDataToServer();
  await loadTasksUserOrGuest();
  showTasksOnBoard();
}

function moveToNewList(i, status, event) {
  event.stopPropagation();
  currentTaskCard = document.getElementById(`taskCard_${i}`);
  let cardStatus = tasks[i].status;
  if (status !== cardStatus) {
    tasks[i].status = status;
    showTasksOnBoard();
  }
}

async function checkUser() {
  let userLogin = localStorage.getItem('userLogin');
  if (userLogin == 'true') {
    let userEmail = localStorage.getItem('userEmail');
    userEmail = userEmail.replace(/"/g, '');
    let user = users.find((u) => u.email == userEmail);
    return user;
  }
}

async function sendDataToServer() {
  let user = await checkUser();
  if (user) {
    await setItem(`${user.email}_tasks`, JSON.stringify(tasks));
  } else {
    await setItem('guestTasks', JSON.stringify(tasks));   
  }
  initBoard();
}


async function checkUserLogin() {
  let userLogin = localStorage.getItem('userLogin');
  if (userLogin == 'true') {
    let userEmail = localStorage.getItem('userEmail');
    userEmail = userEmail.replace(/"/g, '');
    users = JSON.parse(await getItem('users'));
    let user = users.find((u) => u.email == userEmail);
    if (user) {
      return user;
    }
  } else {
    return false;
  }
}

async function deleteTask(i) {
  tasks.splice(i, 1);
  openOrCloseAlertContainer('confirm_container', 'close');
  await sendDataToServer();
  await loadTasksUserOrGuest();
  showTasksOnBoard();
}

function getTaskIndex() {
  for (let i = 0; i < tasks.length; i++) {
    return i;
  }
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

function allowDrop(ev) {
  ev.preventDefault();
}

function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

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

function getListItemInfo() {
  let listIds = {
    toDo: 1,
    inProgress: 2,
    awaitFeedback: 3,
    done: 4,
  };
  return listIds;
}

function closeCardContextMenu(i, event) {
  event.stopPropagation();
  const contextMenuContainer = document.getElementById(`context_menu_${i}`);
  contextMenuContainer.classList.add('d-none');
}

function openOrCloseContainer(i, containerId, action) {
  const cardMenuContainer = document.getElementById(containerId);
  if (containerId === `detail_task_wrapper_${i}`) {
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
  } else if (action === 'open') {
    cardMenuContainer.classList.remove('d-none');
  } else if (action === 'close') {
    cardMenuContainer.classList.add('d-none');
  }
}

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



function editTask(i) {
  checkForCurrentSubtaskStatus(i);
  countCheckedSubtasks(tasks[i].subtasks);
  preserveOriginalTask(tasks[i]);
  replaceCategory(i);
  addClassToContainer(i);
  editTitle(i, tasks[i]);
  editDescription(i, tasks[i]);
  editDueDate(i, tasks[i]);
  editPriority(i, tasks[i]);
  editContacts(i);
  makeSubtasksEditable(i, tasks[i]);
  createOkButton(i);
}

function countCheckedSubtasks(subtasksArray) {
  subtasksArray.reduce((count, subtask) => {
    return count + (subtask.checked_status === true ? 1 : 0);
  }, 0);
}

function preserveOriginalTask(oneTask) {
  const clonedTask = { ...oneTask };
  currentlyEditedTask[0] = clonedTask;
}

function replaceCategory(i) {
  const closeBox = document.getElementById(`category_and_close_wrapper${i}`);
  closeBox.innerHTML = '';
  closeBox.innerHTML = generateCloseIcon(i);
}


function addClassToContainer(i) {
  const editTaskWrapper = document.getElementById(`edit_task_wrapper${i}`);
  editTaskWrapper.classList.add('edit-task-wrapper');
}

function editTitle(i, oneTask) {
  const taskTitleBox = document.getElementById(`detail_title${i}`);
  taskTitleBox.innerHTML = '';
  taskTitleBox.innerHTML = generateEditTitleHTML(i, oneTask);
}

function updateEditedTitle(i) {
  const editTitleInput = document.getElementById(`edited_task_title_${i}`);
  const instructionBox = document.getElementById(`title_instruction_text_${i}`);
  let newTitle = editTitleInput.value.trim();
  if (newTitle !== '') {
    tasks[i].title = newTitle;
    editTitleInput.classList.remove('warning');
    instructionBox.classList.remove('red');
  } else {
    showTitleWarning(i);
  }
}

function showTitleWarning(i) {
  const editTitleInput = document.getElementById(`edited_task_title_${i}`);
  const instructionBox = document.getElementById(`title_instruction_text_${i}`);
  editTitleInput.classList.add('warning');
  instructionBox.classList.add('red');
}

function editDescription(i, oneTask) {
  const taskDescriptionBox = document.getElementById(`detail_description${i}`);
  taskDescriptionBox.innerHTML = '';
  taskDescriptionBox.innerHTML = generateEditDescriptionHTML(i, oneTask);
}

function updateEditedDescription(i) {
  const editDescriptionInput = document.getElementById(
    `edited_task_description${i}`
  );
  let newDescription = editDescriptionInput.value;
  tasks[i].description = newDescription;
}

function editDueDate(i, oneTask) {
  const dueDateBox = document.getElementById(`current_due_date_${i}`);
  let minimumDueDate = standardDateOfToday();
  dueDateBox.innerHTML = '';
  dueDateBox.innerHTML = generateEditDueDateHTML(i, oneTask, minimumDueDate);
}

function standardDateOfToday() {
  return new Date().toISOString().split('T')[0];
}

function updateEditedDueDate(i) {
  const editDueDateInput = document.getElementById(`edited_task_due_date${i}`);
  const instructionBox = document.getElementById(
    `due_date_instruction_text${i}`
  );
  let newDueDate = editDueDateInput.value;
  if (newDueDate !== '') {
    tasks[i].current_due_date = newDueDate;
    editDueDateInput.classList.remove('warning');
    instructionBox.classList.remove('red');
  } else {
    showDueDateWarning(i);
  }
}

function showDueDateWarning(i) {
  const editDueDateInput = document.getElementById(`edited_task_due_date${i}`);
  const instructionBox = document.getElementById(
    `due_date_instruction_text${i}`
  );
  editDueDateInput.classList.add('warning');
  instructionBox.classList.add('red');
}

function editPriority(i, oneTask) {
  const priorityBox = document.getElementById(`task_priority_wrapper${i}`);
  priorityBox.innerHTML = '';
  priorityBox.innerHTML = generatePriorityButtonsHTML(i);
  changePrioStatusEdit(i, oneTask.current_prio);
}

function updateButtonsEdit(i, buttonType, isActive) {
  const prioButton = document.getElementById(`prio_button_${buttonType}_${i}`);
  if (isActive) {
    prioButton.classList.add(`prio-marked-${buttonType}`);
  } else {
    prioButton.classList.remove(`prio-marked-${buttonType}`);
  }
}

function changePrioStatusEdit(i, prioStatus) {
  const buttonTypes = ['urgent', 'medium', 'low'];
  buttonTypes.forEach((type) => updateButtonsEdit(i, type, false));
  updateButtonsEdit(i, prioStatus, true);
  if (prioStatus === 'urgent') {
    tasks[i].current_prio = prioStatus;
  } else if (prioStatus === 'medium') {
    tasks[i].current_prio = prioStatus;
  } else if (prioStatus === 'low') {
    tasks[i].current_prio = prioStatus;
  }
}

async function editContacts(i) {
  const contactsWrapper = document.getElementById(
    `detail_task_contacts_wrapper${i}`
  );
  contactsWrapper.innerHTML = '';
  let user = await checkUserLogin();
  if (user) {
    contactsWrapper.innerHTML = generateContactsDropdownHTML(i);
    renderEditContactList(i);
  } else {
    contactsWrapper.innerHTML = generateContactsDropdownHTML(i);
    renderEditContactList(i);
  }
}

function renderEditContactList(i) {
  const editContactsList = document.getElementById(`edit_contact_list${i}`);
  editContactsList.innerHTML = '';
  editContactsList.innerHTML += generateEditSelectAllHTML(i);
  let j;
  for (let j = 0; j < contacts.length; j++) {
    const oneContact = contacts[j];
    editContactsList.innerHTML += generateContactListEditHTML(i, j, oneContact);
    adaptInitialsToBackground(`initials_icon_${i}_${j}`);
  }
  addEditCheckboxEventListeners(i);
  updateCheckboxes(i, j);
}


function addEditCheckboxEventListeners(i) {
  const checkAllEditCheckbox = document.getElementById(
    `select_all_checkbox_${i}`
  );
  checkAllEditCheckbox.addEventListener('change', function () {
    selectAndUnselectAllEditContacts(i, checkAllEditCheckbox);
  });
}

function selectAndUnselectAllEditContacts(i, checkAllEditCheckbox) {
  for (let j = 0; j < contacts.length; j++) {
    const individualEditCheckbox = document.getElementById(
      `contact_checkbox_${i}_${j}`
    );
    if (checkAllEditCheckbox.checked && !individualEditCheckbox.checked) {
      individualEditCheckbox.checked = true;
      onCheckboxChange(i, j);
    } else if (
      !checkAllEditCheckbox.checked &&
      individualEditCheckbox.checked
    ) {
      individualEditCheckbox.checked = false;
      onCheckboxChange(i, j);
    }
  }
}

function updateCheckboxes(i) {
  const editContactsList = document.getElementById(`edit_contact_list${i}`);
  const selectAllCheckbox = document.getElementById(`select_all_checkbox_${i}`);
  const checkboxes = editContactsList.querySelectorAll(
    'input[type="checkbox"].individual-checkbox'
  );
  checkboxes.forEach((checkbox, j) => {
    const oneContact = contacts[j];
    const isChecked = isContactSelected(oneContact, i);
    checkbox.checked = isChecked;
  });
  selectAllCheckbox.checked = areAllContactsAdded(i);
}

function isContactSelected(contact, taskIndex) {
  const currentlyEditedContacts = tasks[taskIndex].current_contacts;
  return currentlyEditedContacts.some((selectedContactEdit) => {
    return (
      selectedContactEdit.name === contact.name &&
      selectedContactEdit.e_mail === contact.e_mail &&
      selectedContactEdit.phone === contact.phone &&
      selectedContactEdit.color === contact.color
    );
  });
}

function onCheckboxChange(i, j) {
  const checkbox = document.getElementById(`contact_checkbox_${i}_${j}`);
  const contact = contacts[j];

  if (checkbox.checked) {
    addContactToCurrentContacts(i, contact);
  } else {
    removeContactFromCurrentContacts(i, contact);
  }
}

function addContactToCurrentContacts(i, contact) {
  const currentContactsArray = tasks[i].current_contacts;
  if (!isContactInCurrentContacts(i, contact)) {
    currentContactsArray.push(contact);
  }
}

function removeContactFromCurrentContacts(i, contact) {
  const currentContactsArray = tasks[i].current_contacts;
  const indexToRemove = currentContactsArray.findIndex((existingContact) => {
    return (
      existingContact.name === contact.name &&
      existingContact.e_mail === contact.e_mail &&
      existingContact.phone === contact.phone &&
      existingContact.color === contact.color
    );
  });
  if (indexToRemove !== -1) {
    currentContactsArray.splice(indexToRemove, 1);
  }
}

function isContactInCurrentContacts(i, contact) {
  const currentContactsArray = tasks[i].current_contacts;
  return currentContactsArray.some(
    (existingContact) => existingContact === contact
  );
}

function areAllContactsAdded(taskIndex) {
  const currentContacts = tasks[taskIndex].current_contacts;
  if (currentContacts.length !== contacts.length) {
    return false;
  }
  for (const contact of contacts) {
    if (!currentContacts.some(selectedContactEdit => isEqualContacts(selectedContactEdit, contact))) {
      return false;
    }
  }

  return true;
}

function isEqualContacts(contact1, contact2) {
  return (
    contact1.name === contact2.name &&
    contact1.e_mail === contact2.e_mail &&
    contact1.phone === contact2.phone &&
    contact1.color === contact2.color
  );
}


function toggleDropdownList(i, idContainer, idArrow, event) {
  event.stopPropagation();
  scrollToBottom(i);
  const DROPDOWN_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  DROPDOWN_LIST.classList.toggle('show');
  SELECT_ARROW.classList.toggle('turn');
}

function makeSubtasksEditable(i, oneTask) {
  const subtasksBox = document.getElementById(
    `detail_task_subtasks_wrapper${i}`
  );
  subtasksBox.innerHTML = '';
  subtasksBox.innerHTML = generateMakeSubtasksEditableHTML(i);
  renderSubtasksList(i, oneTask);
}

function renderSubtasksList(i, oneTask) {
  const subtasksListContainer = document.getElementById(
    `subtask_container_${i}`
  );
  subtasksListContainer.innerHTML = '';
  for (let j = 0; j < oneTask.subtasks.length; j++) {
    const oneSubtask = oneTask.subtasks[j];
    subtasksListContainer.innerHTML += generateSubtasksListHTML(
      i,
      j,
      oneSubtask
    );
  }
}



function showAndHideCancelAndAcceptSubtask(i, action) {
  const closeAndCheckWrapper = document.getElementById(
    `close_and_check_wrapper_${i}`
  );
  const subtasksPlusButton = document.getElementById(`subtask_plus_${i}`);
  if (action === 'show') {
    closeAndCheckWrapper.classList.remove('d-none');
    subtasksPlusButton.classList.add('d-none');
  } else if (action === 'hide') {
    closeAndCheckWrapper.classList.add('d-none');
    subtasksPlusButton.classList.remove('d-none');
  }
}

function clearSubtask(i) {
  const addSubtaskInputfield = document.getElementById(`input_subtasks${i}`);
  addSubtaskInputfield.value = '';
}

function addNewSubtask(i) {
  const addSubtaskInputfield = document.getElementById(`input_subtasks${i}`);
  let newSubtask = {
    subtask_name: addSubtaskInputfield.value,
    checked_status: false,
  };
  tasks[i].subtasks.push(newSubtask);
  addSubtaskInputfield.value = '';
  renderSubtasksList(i, tasks[i]);
  showAndHideCancelAndAcceptSubtask(i, 'hide');
}

function editSubtask(i, j) {
  let oneSubtask = tasks[i].subtasks[j];
  const subtaskListItem = document.getElementById(
    `subtask_list_item_wrapper${i}_${j}`
  );
  subtaskListItem.innerHTML = '';
  subtaskListItem.innerHTML = generateEditSubtaskInputHTML(i, j, oneSubtask);
}



function clearInputField(i, j) {
  const editSubtaskInputfield = document.getElementById(
    `edit_subtask_input_${i}_${j}`
  );
  editSubtaskInputfield.value = '';
}

function updateEditedSubtask(i, j) {
  const editSubtaskInputfield = document.getElementById(
    `edit_subtask_input_${i}_${j}`
  );

  if (editSubtaskInputfield.value !== '') {
    let newCheckedSubtaskStatus = tasks[i].subtasks[j].checked_status;
    let editedSubtask = {
      subtask_name: editSubtaskInputfield.value,
      checked_status: newCheckedSubtaskStatus,
    };
    tasks[i].subtasks[j] = editedSubtask;
    renderSubtasksList(i, tasks[i]);
  } else {
    renderAlert(
      'alert_container',
      'alert_content',
      'Please enter a subtask text!'
    );
  }
}

function deleteSubtask(i, j) {
  const currentSubtask = tasks[i].subtasks[j];
  let currentSubtaskStatus = currentSubtask.checked_status;
  if (currentSubtaskStatus === true) {
    tasks[i].completed_subtasks--;
    tasks[i].subtasks.splice(j, 1);
  } else {
    tasks[i].subtasks.splice(j, 1);
  }
  renderSubtasksList(i, tasks[i]);
}

function scrollToBottom(i) {
  const container = document.getElementById(`bottom_${i}`);

  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

function createOkButton(i) {
  const okayButtonContainer = document.getElementById(`delete_and_edit_${i}`);
  okayButtonContainer.innerHTML = '';
  okayButtonContainer.innerHTML = generateOkayButtonHTML(i);
}

function closeTaskWithoutSaving(i) {
  tasks[i] = currentlyEditedTask[0];
  currentlyEditedTask = [];
  renderTaskDetailView(i);
}

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

