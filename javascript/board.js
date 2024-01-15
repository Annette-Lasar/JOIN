// falls User-Login, dann das JSON-Array des jeweiligen Users vom Server hier rein laden; ansonsten das Array 'guestTasks' vom Server holen
// egal welche Login-Art: Die Arrays werden immer in das Array tasks[] geladen; danach wird das Array tasks[] gerendert
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

// prüfen ob Gäste- oder User-Login: je nachdem wird das jeweilige JSON-Array vom Server geladen, d.h. entweder das jeweilige UserTaskArray oder das Gäste-Array
async function loadTasksUserOrGuest() {
  let userLogin = localStorage.getItem('userLogin');
  if (userLogin == 'true') {
    let userEmail = localStorage.getItem('userEmail');
    userEmail = userEmail.replace(/"/g, '');
    users = JSON.parse(await getItem('users'));
    let user = users.find((u) => u.email === userEmail);
    if (user) {                                   
          tasks = JSON.parse(await getItem(`${user.email}`));    
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
    status,
    newTruncatedSentence,
    completedSubtasksInPercent
  );
  updateProgressBar(i, tasks[i]); // Kommentar:  Funktionen hier richtig platziert?
  updateCompletedTasks(i, tasks[i]);
  renderContactsOnOutsideCard(i, oneTask);
  renderContactsInsideCard(i, oneTask);
  renderSubtasks(i, oneTask);
  getFilteredDueDate(i, oneTask);
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
  const editTaskContactNameContainer = document.getElementById(
    `edit_contacts_name_${i}`
  );
  editTaskContactNameContainer.innerHTML = '';
  for (let j = 0; j < oneTask.current_contacts.length; j++) {
    const oneContact = oneTask.current_contacts[j];
    editTaskContactNameContainer.innerHTML +=
      generateEditTaskContactNamesHTML(oneContact);
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

function generateEditTaskContactNamesHTML(oneContact) {
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
    `edit_subtasks_wrapper_${i}`
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
        console.log('oneTask: ', oneTask);
        const indiviualSubtaskCheckbox = document.getElementById(
          'individual_subtask_checkbox_${i}_${j}'
        );
        if (!indiviualSubtaskCheckbox.hasEventListener) {
          indiviualSubtaskCheckbox.addEventListener('change', function () {
            console.log('nochmal oneSubtask: ', oneTask.subtasks[${j}]);
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
  console.log('completed im JSON: ', oneTask.completed_subtasks);
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
  status,
  newTruncatedSentence,
  completedSubtasksInPercent
) {
  return /* html */ `
          <div id="taskCard_${i}" draggable="true" onclick="openOrCloseContainer(${i}, 'edit_task_wrapper_${i}', 'open')" oncontextmenu="openOrCloseContainer(${i}, 'context_menu_${i}', 'open')" ondragstart="startDragging(${i})" class="todo">
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
              <div id="context_menu_${i}" class="context-menu-card d-none">  
                <div>
                  <div class="context-menu-move-to-wrapper">
                    <h3>Move card to ...</h3>  
                    <img onclick="openOrCloseContainer(${i}, 'context_menu_${i}', 'close')" id="context_menu_close_${i}" class="context-menu-close" src="../icons/close_white.svg" alt="">
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
          <div id="edit_task_wrapper_${i}" class="edit-task-wrapper d-none">
              <div class="category-and-close-wrapper">
                <div class="todo-category" style="background-color: ${oneTask.current_category[0].category_color}; border: 1px solid ${oneTask.current_category[0].category_color};">${oneTask.current_category[0].category_name}</div>
                <img class="edit-close-button" onclick="openOrCloseContainer(${i}, 'edit_task_wrapper_${i}', 'close')" src="../icons/close.svg" alt="">
              </div>
              <h4>${oneTask.title}</h4>
              <div class="task-description">${oneTask.description}</div>
              <div class="task-due-date-wrapper">
              <span class="due-date">Due date: </span>
              <span id="current_due_date_${i}">${oneTask.current_due_date}</span>
              </div>
              <div class="task-priority-wrapper">
                <div class="priority">Priority: </div>
                <div class="prio-wrapper">
                  <div>${oneTask.current_prio}</div>
                  <img class="prio-icon" src="../icons/prio_${oneTask.current_prio}.svg" alt="">
                </div>
              </div>
              <div class="edit-task-contacts-wrapper">
                <div class="assigned-to">Assigned To:</div>
                <div>
                  <div class="edit-contacts-wrapper">
                  <div id="edit_contacts_name_${i}" class="contact-name"></div>
                  </div>
                </div>
              </div>
              <div class="edit-task-subtasks-wrapper">
                <div class="subtasks-title">Subtasks:</div>
                <div id="edit_subtasks_wrapper_${i}" class="edit-subtasks-wrapper">
                </div>
              </div>
              <div class="delete-and-edit-wrapper">
                <div class="delete-and-edit">
                  <div onclick="renderConfirmDelete(${i}, 'confirm_container', 'confirm_content', 'Are you sure you want to delete this task permanently? This process is irreversible.');" class="delete-wrapper">
                    <img src="../icons/delete.svg" alt="">
                    <div>Delete</div>
                  </div>
                  <div class="edit-wrapper">
                    <img src="../icons/edit_dark.svg" alt="">
                    <div>Edit</div>
                  </div>
                </div>
                </div>
          </div>
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
      await setItem(`${user.email}`, JSON.stringify(tasks));
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
    let user = users.find((u) => u.email == userEmail);
    if (user) {
      return user;
    }
  } else {
    return false;
  }
}

async function deleteTask(i) {
  let currentUser = checkUserLogin();
  if (currentUser) {
    tasks.splice(i, 1);
    console.log('tasks: ', tasks);
  } else {
    renderAlert(
      'alert_container',
      'alert_content',
      "You are not authorized to delete tasks from the guest's account. Please open your own account."
    );
  }
  openOrCloseAlertContainer('confirm_container', 'close');
  await sendDataToServer();
  console.log('tasks: ', tasks);
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

function openOrCloseContainer(i, containerId, action) {
  const cardMenuContainer = document.getElementById(containerId);
  if (containerId === `edit_task_wrapper_${i}`) {
    if (action === 'open') {
      addTaskCardEventListener();
      checkForCurrentSubtaskStatus(i);
      updateProgressBar(i, tasks[i]);
      updateCompletedTasks(i, tasks[i]);
      cardMenuContainer.classList.remove('d-none');
      document.body.style.overflow = 'hidden';
    } else if (action === 'close') {
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
