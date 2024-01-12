// falls User-Login, dann das JSON-Array des jeweiligen Users vom Server hier rein laden; ansonsten das Array 'guestTasks' vom Server holen
// egal welche Login-Art: Die Arrays werden immer in das Array tasks[] geladen; danach wird das Array tasks[] gerendert
let tasks = [];
let filteredTasks = [];
let completedSubtasks = 2;

let currentDraggedElement;

async function initBoard() {
  await loadTasksUserOrGuest();
  showTasksOnBoard('toDo');
  showTasksOnBoard('inProgress');
  showTasksOnBoard('awaitFeedback');
  showTasksOnBoard('done');
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
      if (`${user.email}`) {
        tasks = JSON.parse(await getItem(`${user.email}`));
      }
    }
  } else {
    tasks = JSON.parse(await getItem('guestTasks'));
  }
}

function showTasksOnBoard(status) {
  let filtered = tasks.filter((t) => t['status'] == status);
  filtered.forEach((item) => filteredTasks.push(item));
  console.log('Gefiltertes Array: ', filtered);
  document.getElementById(status).innerHTML = '';
  for (let i = 0; i < filtered.length; i++) {
    const element = filtered[i];
    const numberOfSubtasks = element.subtasks.length;
    console.log('Wie viele Subtasks: ', numberOfSubtasks);
    console.log('Element: ', element);
    let newTruncatedSentence = truncateSentence(element.description, 6);
    let completedSubtasksInPercent = calculateSubtaskPercentage(element);
    document.getElementById(status).innerHTML += generateToDoHTML(
      i,
      element,
      status,
      newTruncatedSentence,
      completedSubtasksInPercent
    );
    console.log('Prozent: ', completedSubtasksInPercent);

    window.addEventListener('resize', function () {
      renderTaskContacts(i, element, status);
    });
  }
  renderTaskContacts();
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

function calculateSubtaskPercentage(element) {
  if (element.subtasks.length > 0) {
    return (completedSubtasks / element.subtasks.length) * 100;
  } else {
    return 0;
  }
}

// Kommentar: Hier die Berechnung für den Overflow-Indikator einfügen!!
function renderTaskContacts() {
  let taskContactContainer;
  let i = 0;
  let filteredTask;
  for (i = 0; i < filteredTasks.length; i++) {
    filteredTask = filteredTasks[i];
    let taskStatus = filteredTask.status;
    taskContactContainer = document.getElementById(
      `task_contact_${taskStatus}_${i}`
    );
    taskContactContainer.innerHTML = '';
    const maxWidth = taskContactContainer.offsetWidth;
    console.log('maximale Breite: ', maxWidth);
    let visibleContacts = filteredTask.current_contacts.slice();
    let hiddenContactsCount = 0;

    while (
      calculateTotalWidth(visibleContacts) > maxWidth &&
      visibleContacts.length > 1
    ) {
      console.log('Sichtbare Kontakte: ', visibleContacts);
      hiddenContactsCount++;
      visibleContacts.pop();
    }
    for (let j = 0; j < visibleContacts.length; j++) {
      const oneContact = visibleContacts[j];
      console.log('Hallo.');
      taskContactContainer.innerHTML += generateTaskContactHTML(j, oneContact);
    }
    if (hiddenContactsCount > 0) {
      const overflowIndicatorHTML =
        generateOverflowIndicatorHTML(hiddenContactsCount);
      taskContactContainer.innerHTML += overflowIndicatorHTML;
    }
  }
}

/* // Kommentar: Hier die Berechnung für den Overflow-Indikator einfügen!!
function renderTaskContacts(i, element, status) {
  const taskContactContainer = document.getElementById(
    `task_contact_${status}_${i}`
  );
  taskContactContainer.innerHTML = '';
  const maxWidth = taskContactContainer.offsetWidth;
  console.log('maximale Breite: ', maxWidth);
  let visibleContacts = element.current_contacts.slice();
  let hiddenContactsCount = 0;

  while (
    calculateTotalWidth(visibleContacts) > maxWidth &&
    visibleContacts.length > 1
  ) {
    hiddenContactsCount++;
    visibleContacts.pop();
  }
  for (let j = 0; j < visibleContacts.length; j++) {
    const oneContact = visibleContacts[i];
    taskContactContainer.innerHTML += generateTaskContactHTML(
      j,
      element,
      oneContact
    );
  }
  if (hiddenContactsCount > 0) {
    const overflowIndicatorHTML =
      generateOverflowIndicatorHTML(hiddenContactsCount);
    taskContactContainer.innerHTML += overflowIndicatorHTML;
  }
} */

function calculateTotalWidth(contacts) {
  const contactWidth = 25;
  return contacts.length * contactWidth;
}

function generateOverflowIndicatorHTML(hiddenContactsCount) {
  return /* html */ `
      <div id="overflow_indicator" class="overflow-indicator">
        +${hiddenContactsCount}
      </div>
    `;
}

window.addEventListener('resize', function () {
  renderTaskContacts();
});

function generateTaskContactHTML(j, oneContact) {
  const [firstName, lastName] = oneContact.name.split(' ');
  return /* html */ `
        <div class="initials-icon" style="background-color: ${
          oneContact.color
        }">${firstName[0]}${lastName ? lastName[0] : ''}</div>
    `;
}

// Kommentar: Anzahl der erledigten Subtasks rendern
function generateToDoHTML(
  i,
  element,
  status,
  newTruncatedSentence,
  completedSubtasksInPercent
) {
  return /* html */ `
          <div draggable="true" onclick="openOrCloseContainer(${i}, 'edit_task_wrapper_${status}_${i}', 'open')" oncontextmenu="openOrCloseContainer(${i}, 'context_menu_${status}_${i}', 'open')" ondragstart="startDragging(${element['id']})" class="todo">
            <div class="todo-category" style="background-color: ${element.current_category[0].category_color}; border: 1px solid ${element.current_category[0].category_color};">${element.current_category[0].category_name}</div>
              <div class="todo-title">${element['title']}</div>
                <div class="todo-description">${newTruncatedSentence}</div>
                <div class="progress-wrapper">
                  <progress id="progress_bar" class="progress-bar" value="${completedSubtasksInPercent}" max="100"> 32% </progress>  
                  <label class="label-for-progress" for="progress_bar">0/${element.subtasks.length} Subtasks</label>
                </div>
                <div class="contacts-and-prio-wrapper">
                  <div id="task_contact_${status}_${i}" class="task-contact-wrapper"></div>
                  <div class="task-prio">
                      <img class="prio-icon" src="../icons/prio_${element.current_prio}.svg">
                  </div>
              </div>
              <div id="context_menu_${status}_${i}" class="context-menu-card d-none">  
                <div>
                  <div class="context-menu-move-to-wrapper">
                    <h3>Move card to ...</h3>  
                    <img onclick="openOrCloseContainer(${i}, 'context_menu_${status}_${i}', 'close')" id="context_menu_${status}_close_${i}" class="context-menu-close" src="../icons/close_white.svg" alt="">
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
          <div id="edit_task_wrapper_${status}_${i}" class="edit-task-wrapper d-none">
              <div class="category-and-close-wrapper">
                <div class="todo-category" style="background-color: ${element.current_category[0].category_color}; border: 1px solid ${element.current_category[0].category_color};">${element.current_category[0].category_name}</div>
                <img class="edit-close-button" onclick="openOrCloseContainer(${i}, 'edit_task_wrapper_${status}_${i}', 'close')" src="../icons/close.svg" alt="">
              </div>
              <h4>${element.title}</h4>
              <div class="task-description">${element.description}</div>
              <div class="task-due-date-wrapper">
              <span>Due date: </span>
              <span>${element.current_due_date}</span>
              </div>
              <div class="task-priority-wrapper">
                <span>Priority: </span>
                <span>${element.current_prio}</span>
                <img src="../icons/prio_${element.current_prio}.svg" alt="">
              </div>
              <div class="edit-task-contacts-wrapper">
                <div>Assigned To:</div>
                <div>
                  <div>
                    <div class="initials"></div>
                    <div class="contact-name"></div>
                  </div>
                </div>
              </div>
              <div class="edit-task-subtasks-wrapper">
                <div>Subtasks:</div>
                <div>
                  <div>
                    <div class="checkbox"><input type="checkbox"></div>
                    <div class="subtask-name">Hier Subtask einfügen</div>
                  </div>
                </div>
              </div>
              <div class="delete-and-edit-wrapper">
                <div class="delete-and-edit">
                  <div class="delete-wrapper">
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
  tasks[currentDraggedElement]['status'] = status;
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
  initBoard();
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

function openOrCloseContainer(i, containerId, action) {
  const cardMenuContainer = document.getElementById(containerId);
  if (
    containerId === `edit_task_wrapper_toDo_${i}` ||
    containerId === `edit_task_wrapper_inProgress_${i}` ||
    containerId === `edit_task_wrapper_awaitFeedback_${i}` ||
    containerId === `edit_task_wrapper_done_${i}`
  ) {
    if (action === 'open') {
      cardMenuContainer.classList.remove('d-none');
      document.body.style.overflow = 'hidden';
    } else if (action === 'close') {
      cardMenuContainer.classList.add('d-none');
      document.body.style.overflow = 'visible';
    }
  } else if (action === 'open') {
    cardMenuContainer.classList.remove('d-none');
  } else if (action === 'close') {
    cardMenuContainer.classList.add('d-none');
  }
}
