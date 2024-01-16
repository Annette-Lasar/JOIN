let tasks = [];
let completedSubtasks = 2;

let currentDraggedElement;

async function initBoard() {
  await loadTasksUserOrGuest();
  showTasksOnBoard();
  addTaskCardEventListener();
}

function clearContainers(...containerIDs) {
  containerIDs.forEach(function (id) {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = '';
    }
  });
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
    }
  } else {
    tasks = JSON.parse(await getItem('guestTasks'));
  }
}

function showTasksOnBoard() {
  clearContainers('toDo', 'inProgress', 'awaitFeedback', 'done');
  for (let i = 0; i < tasks.length; i++) {
    const oneTask = tasks[i];
    let status = oneTask.status;
    callFurtherFunctionsToRenderTasks(i, oneTask, status);
  }
}

function callFurtherFunctionsToRenderTasks(i, oneTask, status) {
  let newTruncatedSentence = truncateSentence(oneTask.description, 6);
  let completedSubtasksInPercent = calculateSubtaskPercentage(i, oneTask);
  document.getElementById(status).innerHTML += generateToDoHTML(
    i,
    oneTask,
    newTruncatedSentence,
    completedSubtasksInPercent
  );
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
  const progressBar = document.getElementById(`progress_bar_${i}`);
  let completedSubtasksInPercent = calculateSubtaskPercentage(i, oneTask);
  progressBar.value = completedSubtasksInPercent;
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
    calculateNumberOfVisibleContacts(oneTask, taskContactContainer);
  }
}

function calculateNumberOfVisibleContacts(oneTask, taskContactContainer) {
  const maxWidth = taskContactContainer.offsetWidth;
  let visibleContacts = oneTask.current_contacts.slice();
  let hiddenContactsCount = 0;

  while (
    calculateTotalWidth(visibleContacts) > maxWidth &&
    visibleContacts.length > 1
  ) {
    hiddenContactsCount++;
    visibleContacts.pop();
  }
  showVisibleContactsAndOverflowIndicator(
    visibleContacts,
    hiddenContactsCount,
    taskContactContainer
  );
}

function showVisibleContactsAndOverflowIndicator(
  visibleContacts,
  hiddenContactsCount,
  taskContactContainer
) {
  for (let j = 0; j < visibleContacts.length; j++) {
    const oneContact = visibleContacts[j];
    taskContactContainer.innerHTML += generateTaskContactHTML(oneContact);
  }
  if (hiddenContactsCount > 0) {
    const overflowIndicatorHTML =
      generateOverflowIndicatorHTML(hiddenContactsCount);
    taskContactContainer.innerHTML += overflowIndicatorHTML;
  }
}

function calculateTotalWidth(contacts) {
  const contactWidth = 25;
  return contacts.length * contactWidth + contactWidth;
}

function generateOverflowIndicatorHTML(hiddenContactsCount) {
  return /* html */ `
      <div id="overflow_indicator" class="overflow-indicator">
        +${hiddenContactsCount}
      </div>
    `;
}

function renderContactsInsideCard(i, oneTask) {
  const detailTaskContactNameContainer = document.getElementById(
    `detail_contacts_name_${i}`
  );
  detailTaskContactNameContainer.innerHTML = '';
  for (let j = 0; j < oneTask.current_contacts.length; j++) {
    const oneContact = oneTask.current_contacts[j];
    detailTaskContactNameContainer.innerHTML +=
      generateDetailTaskContactNamesHTML(oneContact);
  }
}

window.addEventListener('resize', function () {
  showTasksOnBoard();
});

function generateTaskContactHTML(oneContact) {
  const [firstName, lastName] = oneContact.name.split(' ');
  return /* html */ `
        <div class="initials-icon" style="background-color: ${
          oneContact.color
        }">${firstName[0]}${lastName ? lastName[0] : ''}</div>
    `;
}

function generateDetailTaskContactNamesHTML(oneContact) {
  const [firstName, lastName] = oneContact.name.split(' ');
  return /* html */ `
      <div class="initials-and-name-wrapper">
        <div class="initials-icon" style="background-color: ${
          oneContact.color
        }">${firstName[0]}${lastName ? lastName[0] : ''}</div>
        <div>${oneContact.name}</div>
        
      </div>
    `;
}

function getFilteredDueDate(i, oneTask) {
  const dueDateContainer = document.getElementById(`current_due_date_${i}`);
  dueDateContainer.innerHTML = '';
  let inputDate = oneTask.current_due_date;
  let currentDueDate = formatDateString(inputDate);
  dueDateContainer.innerHTML = currentDueDate;
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

function renderSubtasks(i, oneTask) {
  const subtaskContainer = document.getElementById(
    `detail_subtasks_wrapper_${i}`
  );
  subtaskContainer.innerHTML = '';
  for (let j = 0; j < oneTask.subtasks.length; j++) {
    const oneSubtask = oneTask.subtasks[j];
    subtaskContainer.innerHTML += generateSubtaskHTML(i, j, oneSubtask);
  }
}

/* function addSubtasksEventlistener(i, j) {
  const oneTask = tasks[i];
  console.log('oneTask: ', oneTask);
  const indiviualSubtaskCheckbox = document.getElementById(
    `individual_subtask_checkbox_${i}_${j}`
  );
  indiviualSubtaskCheckbox.addEventListener('change', function () {
    console.log('nochmal oneSubtask: ', oneTask.subtasks[j]);
    checkForCompletedSubtasks(j, oneTask, indiviualSubtaskCheckbox);
  });
} */

// evtl. Alternative zum eventListener in generateSubtaskHTML
/* function addSubtasksEventlistener(i) {
  const oneTask = tasks[i];
  console.log('oneTask: ', oneTask);
  for (let j = 0; j < oneTask.subtasks.length; j++) {
    console.log('oneSubtask: ', oneTask.subtasks[j]);
    const indiviualSubtaskCheckbox = document.getElementById(
      `individual_subtask_checkbox_${i}_${j}`
    );

    // Überprüfen, ob der Event-Listener bereits vorhanden ist, um Mehrfachregistrierungen zu verhindern
    if (!indiviualSubtaskCheckbox.hasEventListener) {
      indiviualSubtaskCheckbox.addEventListener('change', function () {
        console.log('nochmal oneSubtask: ', oneTask.subtasks[j]);
        checkForCompletedSubtasks(j, oneTask, indiviualSubtaskCheckbox);
      });

      // Markiere das Element, um anzuzeigen, dass der Event-Listener registriert ist
      indiviualSubtaskCheckbox.hasEventListener = true;
    }
  }
} */

function generateSubtaskHTML(i, j, oneSubtask) {
  return /* html */ `
      <div onclick="(function() {
        const oneTask = tasks[${i}];
        const indiviualSubtaskCheckbox = document.getElementById(
          'individual_subtask_checkbox_${i}_${j}'
        );
        if (!indiviualSubtaskCheckbox.hasEventListener) {
          indiviualSubtaskCheckbox.addEventListener('change', function () {
            checkForCompletedSubtasks(${j}, oneTask, indiviualSubtaskCheckbox);
          });
          indiviualSubtaskCheckbox.hasEventListener = true;
        }
      })()" class="inner-subtask-wrapper">
          <input id="individual_subtask_checkbox_${i}_${j}" type="checkbox">
          <label for="individual_subtask_checkbox_${i}_${j}" class="subtask-name">${oneSubtask.subtask_name}</label>
      </div>
  `;
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

// Kommentar: Anzahl der erledigten Subtasks rendern
function generateToDoHTML(
  i,
  oneTask,
  newTruncatedSentence,
  completedSubtasksInPercent
) {
  return /* html */ `
          <div id="taskCard_${i}" draggable="true" onclick="openOrCloseContainer(${i}, 'detail_task_wrapper_${i}', 'open')" oncontextmenu="openOrCloseContainer(${i}, 'context_menu_${i}', 'open')" ondragstart="startDragging(${i})" class="todo">
            <div class="todo-category" style="background-color: ${oneTask.current_category[0].category_color}; border: 1px solid ${oneTask.current_category[0].category_color};">${oneTask.current_category[0].category_name}</div>
              <div class="todo-title">${oneTask['title']}</div>
                <div class="todo-description">${newTruncatedSentence}</div>
                <div class="progress-wrapper">
                <progress id="progress_bar_${i}" class="progress-bar" value="${completedSubtasksInPercent}" max="100"> 32 %</progress>  
                  <label id="label_for_progress_bar_${i}" class="label-for-progress" for="progress_bar">${oneTask.completed_subtasks}/${oneTask.subtasks.length} Subtasks</label>
                </div>
                <div class="contacts-and-prio-wrapper">
                  <div id="task_contact_${i}" class="task-contact-wrapper"></div>
                  <div class="task-prio">
                      <img class="prio-icon" src="../icons/prio_${oneTask.current_prio}.svg">
                  </div>
              </div>
              <div id="context_menu_${i}" class="context-menu-card d-none" data-index="${i}">  
                <div>
                  <div class="context-menu-move-to-wrapper">
                    <h3>Move card to ...</h3>  
                    <img id="context_menu_close_${i}" class="context-menu-close" src="../icons/close_white.svg" alt="">
                  </div>
                </div>  
                <ul>
                  <li>To do</li>
                  <li>In progress</li>
                  <li>Await feedback</li>
                  <li>Done</li>
                </ul>
              </div>
          </div>
          <div id="detail_task_wrapper_${i}" class="detail-task-wrapper d-none"></div>
          `;
}

function startDragging(id) {
  currentDraggedElement = id;
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

async function sendDataToServer() {
  let userLogin = localStorage.getItem('userLogin');
  if (userLogin == 'true') {
    let userEmail = localStorage.getItem('userEmail');
    userEmail = userEmail.replace(/"/g, '');
    let user = users.find((u) => u.email == userEmail);
    if (user) {
      await setItem(`${user.email}_tasks`, JSON.stringify(tasks));
    }
  } else {
    await setItem('guestTasks', JSON.stringify(tasks));
  }
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

function addTaskCardEventListener() {
  for (let i = 0; i < tasks.length; i++) {
    const taskCard = document.getElementById(`taskCard_${i}`);
    taskCard.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}

/* document.addEventListener('click', function (event) {
  const CLICKED_ELEMENT = event.target;
  if (CLICKED_ELEMENT.classList.contains('context-menu-card')) {
    const dataIndex = CLICKED_ELEMENT.dataset.index;
    closeContextMenu(dataIndex);
  }
}); */

function closeContextMenu(i) {
  const contextMenuContainer = document.getElementById(`context_menu_${i}`);
  contextMenuContainer.classList.add('d-none');
}

function openOrCloseContainer(i, containerId, action) {
  const cardMenuContainer = document.getElementById(containerId);
  if (containerId === `detail_task_wrapper_${i}`) {
    if (action === 'open') {
      cardMenuContainer.classList.remove('d-none');
      renderTaskDetailView(i);
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
    addTaskCardEventListener();
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
  renderSubtasks(i, tasks[i]);
  checkForCurrentSubtaskStatus(i);
  getFilteredDueDate(i, tasks[i]);
}

function generateDetailViewHTML(i, oneTask) {
  return /* html */ `
        <div id="category_and_close_wrapper${i}" class="category-and-close-wrapper">
          <div class="todo-category" style="background-color: ${oneTask.current_category[0].category_color}; border: 1px solid ${oneTask.current_category[0].category_color};">${oneTask.current_category[0].category_name}</div>
          <img class="detail-close-button" onclick="openOrCloseContainer(${i}, 'detail_task_wrapper_${i}', 'close')" src="../icons/close.svg" alt="">
        </div>
        <div id="edit_task_wrapper${i}">
        <div id="detail_title${i}">
            <h4>${oneTask.title}</h4>
        </div>
        <div id="detail_description${i}">
          <div class="task-description">${oneTask.description}</div>
        </div>
        <div id="current_due_date_${i}" class="task-due-date-wrapper">
          <span class="due-date">Due date: </span>
          <span>${oneTask.current_due_date}</span>
        </div>
        <div id="task_priority_wrapper${i}" class="task-priority-wrapper">
          <div class="priority">Priority:</div>
          <div class="prio-wrapper">
            <div>${oneTask.current_prio}</div>
              <img class="prio-icon" src="../icons/prio_${oneTask.current_prio}.svg" alt="">
          </div>
        </div>
        <div class="detail-task-contacts-wrapper">
          <div class="assigned-to">Assigned To:</div>
          <div>
            <div class="detail-contacts-wrapper">
              <div id="detail_contacts_name_${i}" class="contact-name"></div>
            </div>
          </div>
        </div>
        <div id="detail_task_subtasks_wrapper${i}" class="detail-task-subtasks-wrapper">
          <div class="subtasks-title">Subtasks:</div>
          <div id="detail_subtasks_wrapper_${i}" class="detail-subtasks-wrapper"></div>
        </div>
        </div>
        <div id="delete_and_edit_wrapper${i}" class="delete-and-edit-wrapper">
          <div id="delete_and_edit_${i}" class="delete-and-edit">
            <div onclick="renderConfirmDelete(${i}, 'confirm_container', 'confirm_content', 'Are you sure you want to delete this task permanently? This process is irreversible.');" class="delete-wrapper">
              <img src="../icons/delete.svg" alt="">
              <div>Delete</div>
            </div>
            <div onclick="editTask(${i})" class="edit-wrapper">
              <img src="../icons/edit_dark.svg" alt="">
              <div>Edit</div>
            </div>
          </div>
        </div>
  `;
}

function editTask(i) {
  replaceCategory(i);
  addClassToContainer(i);
  editTitle(i, tasks[i]);
  editDescription(i, tasks[i]);
  editDueDate(i, tasks[i]);
  editPriority(i, tasks[i]);
  editSubtasks(i, tasks[i]);
  createOkButton(i);
}

function replaceCategory(i) {
  const closeBox = document.getElementById(`category_and_close_wrapper${i}`);
  closeBox.innerHTML = '';
  closeBox.innerHTML = generateCloseIcon(i);
}

function generateCloseIcon(i) {
  return /* html */ `
    <div id="edit_close_button_wrapper${i}" class="edit-close-button-wrapper">
      <img class="detail-close-button" onclick="openOrCloseContainer(${i}, 'detail_task_wrapper_${i}', 'close')" src="../icons/close.svg" alt="">
    </div>
  `;
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

function generateEditTitleHTML(i, oneTask) {
  return /* html */ `
      <div class="edited-task-title-wrapper">
          <div class="edit-headline">Title</div>
          <input id="edited_task_title_${i}" type="text" value="${oneTask.title}" class="edited-task-title">
      </div>
  `;
}

function editDescription(i, oneTask) {
  const taskDescriptionBox = document.getElementById(`detail_description${i}`);
  taskDescriptionBox.innerHTML = '';
  taskDescriptionBox.innerHTML = generateEditDescriptionHTML(i, oneTask);
}

function generateEditDescriptionHTML(i, oneTask) {
  return /* html */ `
  <div>
    <div class="edit-headline">Description</div>
    <textarea name="description" id="edited_task_description${i}" class="edited-task-description" cols="30" rows="5" placeholder="Enter your description">${oneTask.description}</textarea>
  </div>
  `;
}

function editDueDate(i, oneTask) {
  const dueDateBox = document.getElementById(`current_due_date_${i}`);
  let minimumDueDate = standardDateoFToday();
  dueDateBox.innerHTML = '';
  dueDateBox.innerHTML = generateEditDueDateHTML(i, oneTask, minimumDueDate);
}

function standardDateoFToday() {
  return new Date().toISOString().split('T')[0];
}

function generateEditDueDateHTML(i, oneTask, minimumDueDate) {
  return /* html */ `
      <div>
        <div class="edit-headline">Due date</div>
        <input id="edited_task_due_date${i}" type="date" min="${minimumDueDate}" class="edited-due-date" value="${oneTask.current_due_date}">
      </div>
  `;
}

function editPriority(i, oneTask) {
  const priorityBox = document.getElementById(`task_priority_wrapper${i}`);
  priorityBox.innerHTML = '';
  priorityBox.innerHTML = generatePriorityButtonsHTML(i);
  changePrioStatus(i, oneTask.current_prio);
}

function generatePriorityButtonsHTML(i) {
  return /* html */ `
    <section id="edit_prio_section${i}" class="edit-prio-section">
              <div class="edit-headline">Priority</div>
              <div id="prio_button_wrapper_${i}" class="prio-button-wrapper">
                <button
                  id="prio_button_urgent_${i}"
                  onclick="changePrioStatus(${i}, 'urgent')"
                  class="prio-button"
                >
                  Urgent
                  <svg
                    class="svg-urgent"
                    width="18"
                    height="12"
                    viewBox="0 0 21 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.5712 14.7547C19.3366 14.7551 19.1081 14.6803 18.9192 14.5412L10.6671 8.458L2.41508 14.5412C2.29923 14.6267 2.16765 14.6887 2.02785 14.7234C1.88805 14.7582 1.74277 14.7651 1.6003 14.7437C1.45783 14.7223 1.32097 14.6732 1.19752 14.599C1.07408 14.5247 0.966466 14.427 0.880837 14.3112C0.795208 14.1954 0.733236 14.0639 0.698459 13.9243C0.663683 13.7846 0.656782 13.6394 0.678153 13.497C0.721312 13.2095 0.877002 12.9509 1.11097 12.7781L10.0151 6.20761C10.2038 6.06802 10.4324 5.99268 10.6671 5.99268C10.9019 5.99268 11.1305 6.06802 11.3192 6.20761L20.2233 12.7781C20.4092 12.915 20.5471 13.1071 20.6173 13.327C20.6874 13.5469 20.6862 13.7833 20.6139 14.0025C20.5416 14.2216 20.4019 14.4124 20.2146 14.5475C20.0274 14.6826 19.8022 14.7551 19.5712 14.7547Z"
                      fill="#FF3D00"
                    />
                    <path
                      d="M19.5713 9.00568C19.3366 9.00609 19.1081 8.93124 18.9192 8.79214L10.6671 2.70898L2.41509 8.79214C2.18112 8.96495 1.88803 9.0378 1.6003 8.99468C1.31257 8.95155 1.05378 8.79597 0.880842 8.56218C0.707906 8.32838 0.634998 8.03551 0.678157 7.74799C0.721316 7.46048 0.877007 7.20187 1.11098 7.02906L10.0151 0.458588C10.2038 0.318997 10.4324 0.243652 10.6671 0.243652C10.9019 0.243652 11.1305 0.318997 11.3192 0.458588L20.2233 7.02906C20.4092 7.16598 20.5471 7.35809 20.6173 7.57797C20.6874 7.79785 20.6863 8.03426 20.6139 8.25344C20.5416 8.47262 20.4019 8.66338 20.2146 8.79847C20.0274 8.93356 19.8022 9.00608 19.5713 9.00568Z"
                      fill="#FF3D00"
                    />
                  </svg>
                </button>
                <button
                  id="prio_button_medium_${i}"
                  onclick="changePrioStatus(${i}, 'medium')"
                  class="prio-button prio-marked-medium"
                >
                  Medium
                  <svg
                    class="svg-medium"
                    width="20"
                    height="9"
                    viewBox="0 0 20 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9041 8.22528H1.09589C0.805242 8.22528 0.526498 8.10898 0.320979 7.90197C0.11546 7.69495 0 7.41419 0 7.12143C0 6.82867 0.11546 6.5479 0.320979 6.34089C0.526498 6.13388 0.805242 6.01758 1.09589 6.01758H18.9041C19.1948 6.01758 19.4735 6.13388 19.679 6.34089C19.8845 6.5479 20 6.82867 20 7.12143C20 7.41419 19.8845 7.69495 19.679 7.90197C19.4735 8.10898 19.1948 8.22528 18.9041 8.22528Z"
                      fill="#FFA35e"
                    />
                    <path
                      d="M18.9041 2.98211H1.09589C0.805242 2.98211 0.526498 2.86581 0.320979 2.6588C0.11546 2.45179 0 2.17102 0 1.87826C0 1.5855 0.11546 1.30474 0.320979 1.09772C0.526498 0.890712 0.805242 0.774414 1.09589 0.774414L18.9041 0.774414C19.1948 0.774414 19.4735 0.890712 19.679 1.09772C19.8845 1.30474 20 1.5855 20 1.87826C20 2.17102 19.8845 2.45179 19.679 2.6588C19.4735 2.86581 19.1948 2.98211 18.9041 2.98211Z"
                      fill="#FFA35e"
                    />
                  </svg>
                </button>
                <button
                  id="prio_button_low_${i}"
                  onclick="changePrioStatus(${i}, 'low')"
                  class="prio-button"
                >
                  Low
                  <svg
                    class="svg-low"
                    width="18"
                    height="12"
                    viewBox="0 0 21 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.334 9.00589C10.0994 9.0063 9.87085 8.93145 9.682 8.79238L0.778897 2.22264C0.663059 2.13708 0.565219 2.02957 0.490964 1.90623C0.416709 1.78289 0.367492 1.64614 0.346125 1.50379C0.30297 1.21631 0.37587 0.923473 0.548786 0.689701C0.721702 0.455928 0.980471 0.300371 1.26817 0.257248C1.55586 0.214126 1.84891 0.286972 2.08286 0.45976L10.334 6.54224L18.5851 0.45976C18.7009 0.374204 18.8325 0.312285 18.9723 0.277538C19.1121 0.242791 19.2574 0.235896 19.3998 0.257248C19.5423 0.2786 19.6791 0.32778 19.8025 0.401981C19.926 0.476181 20.0336 0.573948 20.1192 0.689701C20.2048 0.805453 20.2668 0.936923 20.3015 1.07661C20.3363 1.21629 20.3432 1.36145 20.3218 1.50379C20.3005 1.64614 20.2513 1.78289 20.177 1.90623C20.1027 2.02957 20.0049 2.13708 19.8891 2.22264L10.986 8.79238C10.7971 8.93145 10.5686 9.0063 10.334 9.00589Z"
                      fill="#7AE229"
                    />
                    <path
                      d="M10.334 14.7544C10.0994 14.7548 9.87085 14.68 9.682 14.5409L0.778897 7.97117C0.544952 7.79839 0.389279 7.53981 0.346125 7.25233C0.30297 6.96485 0.37587 6.67201 0.548786 6.43824C0.721702 6.20446 0.980471 6.04891 1.26817 6.00578C1.55586 5.96266 1.84891 6.03551 2.08286 6.2083L10.334 12.2908L18.5851 6.2083C18.8191 6.03551 19.1121 5.96266 19.3998 6.00578C19.6875 6.04891 19.9463 6.20446 20.1192 6.43824C20.2921 6.67201 20.365 6.96485 20.3218 7.25233C20.2787 7.53981 20.123 7.79839 19.8891 7.97117L10.986 14.5409C10.7971 14.68 10.5686 14.7548 10.334 14.7544Z"
                      fill="#7AE229"
                    />
                  </svg>
                </button>
              </div>
            </section>
  `;
}

function updateButtons(i, buttonType, isActive) {
  const prioButton = document.getElementById(`prio_button_${buttonType}_${i}`);
  if (isActive) {
    prioButton.classList.add(`prio-marked-${buttonType}`);
  } else {
    prioButton.classList.remove(`prio-marked-${buttonType}`);
  }
}

// Kann ich den auskommentierten Teil erst beim Okay-Button aufrufen?
function changePrioStatus(i, prioStatus) {
  const buttonTypes = ['urgent', 'medium', 'low'];
  buttonTypes.forEach((type) => updateButtons(i, type, false));
  updateButtons(i, prioStatus, true);
  /* if (prioStatus === 'urgent') {
    tasks[i].current_prio = prioStatus;
    console.log('task-prio: ', tasks[i].current_prio);
  } else if (prioStatus === 'medium') {
    tasks[i].current_prio = prioStatus;
    console.log('task-prio: ', tasks[i].current_prio);
  } else if (prioStatus === 'low') {
    tasks[i].current_prio = prioStatus;
    console.log('task-prio: ', tasks[i].current_prio);
  } */
}

function editSubtasks(i, oneTask) {
  const subtasksBox = document.getElementById(
    `detail_task_subtasks_wrapper${i}`
  );
  subtasksBox.innerHTML = '';
  subtasksBox.innerHTML = generateEditSubtasksHTML(i);
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

function generateEditSubtasksHTML(i) {
  return /* html */ `
    <section id="section_subtasks_${i}">
        <div class="edit-headline">Subtasks</div>
        <div id="edit_subtask_wrapper" class="edit-subtask-wrapper">
          <input
              id="input_subtasks${i}"
              class="input-subtasks"
              type="text"
              placeholder="Add new subtask"
                />
          <div
               id="subtasks_image_wrapper_${i}"
               class="subtasks-image-wrapper"
                >
            <div
               id="close_and_check_wrapper_${i}"
               class="close-and-check-wrapper d-none"
                  >
              <img
                  onclick="clearSubtask('sub_tasks_small', 'close_and_check_wrapper_small', 'subtask_plus')"
                  id="cancel_subtask_${i}"
                  class="cancel-subtask"
                  src="../icons/close.svg"
                    />
                <div class="subtask-separator-line"></div>
                <img
                   onclick="addSubtask('sub_tasks_small', 'close_and_check_wrapper_small', 'subtask_plus')"
                   id="check_subtask_${i}"
                   class="check-subtask"
                   src="../icons/check.svg"
                    />
              </div>
                  <img
                    id="subtask_plus_${i}"
                    class="edit-plus-button"
                    onclick="showCancelAndAcceptSubtask('close_and_check_wrapper_small', 'subtask_plus)"
                    src="../icons/plus.svg"
                  />
                </div>
              </div>
            </section>
            <section
              id="subtask_container_${i}"
              class="subtask-container"
            ></section>
  `;
}

function generateSubtasksListHTML(i, j, oneSubtask) {
  return /* html */ `
    <div class="subtask-list-item-wrapper">
        <div id="subtask_list_item${i}_${j}" class="subtask-list-item">${oneSubtask.subtask_name}</div>
        <div class="subtask-list-item-icon-wrapper">
          <img src="../icons/edit_dark.svg">
          <div class="subtask-icon-separator"></div>
          <img src="../icons/delete.svg">
        </div>
    </div>
        
  `;
}

{
  /* <div id="subtask_list_wrapper_${containerType}_${i}" class="subtask-list-${containerType}">${subtask.subtask_name}
        <div class="subtask-button-wrapper-${containerType}">
          <img onclick="editSubtask(${i}, '${containerType}', '${subtask.subtask_name}')" src="../icons/edit_dark.svg">
          <div class="subtask-separator-line"></div>
          <img onclick="deleteSubtask(${i})" src="../icons/delete.svg">
        </div>
      </div> */
}

function createOkButton(i) {
  const okayButtonContainer = document.getElementById(`delete_and_edit_${i}`);
  okayButtonContainer.innerHTML = '';
  okayButtonContainer.innerHTML = generateOkayButtonHTML(i);
}

// Funktion auf dem Button muss anders sein. Erst muss alles ins Array und auf den Server
function generateOkayButtonHTML(i) {
  return /* html */ `
  <div class="okay-wrapper">
    <button onclick="renderTaskDetailView(${i})" class="edit-okay-button">
      OK
      <img src="../icons/check.svg" height=10">
    </button>
  </div>
  `;
}
