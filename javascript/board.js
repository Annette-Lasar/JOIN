// falls User-Login, dann das JSON-Array des jeweiligen Users vom Server hier rein laden; ansonsten das Array 'guestTasks' vom Server holen
// egal welche Login-Art: Die Arrays werden immer in das Array tasks[] geladen; danach wird das Array tasks[] gerendert
let tasks = [];

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
  console.log('Gefiltertes Array: ', filtered);
  document.getElementById(status).innerHTML = '';
  for (let i = 0; i < filtered.length; i++) {
    const element = filtered[i];
    console.log('Element: ', element);
    const prioElement = element.current_prio;
    console.log('Prio-Element: ', prioElement);
    document.getElementById(status).innerHTML += generateToDoHTML(
      i,
      element,
      status,
      prioElement
    );
  }
}

/* function showTasksOnBoard(status) {
    let filtered = tasks.filter(t => t['status'] == status);
    console.log('Gefiltertes Array: ', filtered);
    document.getElementById(status).innerHTML = '';
    for (let i = 0; i < filtered.length; i++) {
        const element = filtered[i];
        
        for (let j = 0; j < element.current_contacts.length; j++) {
            const contactElement = element.current_contacts[j];
            document.getElementById(status).innerHTML += generateToDoHTML(i, element, contactElement);
        }
    }
} */

/* // diese Funktion rendert die einzelnen Tasks auf das Board
function generateToDoHTML(i, element, contactElement) {
    return  */ /* html */ /* `
        <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
          <div class="todo-category">${element['current_category']}</div>
            <div class="todo-title">${element['title']}</div>
              <div class="todo-description">${element['description']}</div>
              <div class="progress-wrapper">
                <progress id="progress_bar" class="progress-bar" value="32" max="100"> 32% </progress>  
                <label class="label-for-progress" for="progress_bar">${element['subtasks'].length}/2 Subtasks</label>
              </div>
              <div class="contacts-and-prio-wrapper">
                <div class="task-contact-wrapper">
                <div class="task-contact">${element.contactElement}</div>
                </div>
                <div class="task-prio">
                    <!-- <img src="../icons/prio_${element['current_prio'].svg}" alt="" height="32"> -->
                    <img class="prio-icon" src="../icons/prio_medium.svg">
                </div>
            </div>
        </div>`;
} */

// diese Funktion rendert die einzelnen Tasks auf das Board
function generateToDoHTML(i, element, status, prioElement) {
  return /* html */ `
        <div draggable="true" oncontextmenu="openOrCloseContextMenu(${i}, '${status}', 'open')" ondragstart="startDragging(${element['id']})" class="todo">
          <div class="todo-category">${element['current_category']}</div>
            <div class="todo-title">${element['title']}</div>
              <div class="todo-description">${element['description']}</div>
              <div class="progress-wrapper">
                <progress id="progress_bar" class="progress-bar" value="32" max="100"> 32% </progress>  
                <label class="label-for-progress" for="progress_bar">${element['subtasks'].length}/2 Subtasks</label>
              </div>
              <div class="contacts-and-prio-wrapper">
                <div class="task-contact-wrapper">
                <div class="task-contact">${element.current_contacts}</div>
                </div>
                <div class="task-prio">
                    <img src="../icons/prio_${prioElement}.svg" alt="" height="32">
                    <!-- <img class="prio-icon" src="../icons/prio_medium.svg"> -->
                </div>
            </div>
            <div id="context_menu_${status}_${i}" class="context-menu-card d-none">  
              <div>
                <div class="context-menu-move-to-wrapper">
                  <h3>Move card to ...</h3>  
                  <img onclick="openOrCloseContextMenu(${i}, '${status}', 'close')" id="context_menu_${status}_close_${i}" class="context-menu-close" src="../icons/close_white.svg" alt="">
                </div>
                
              </div>  
              <ul>
                <li>To do</li>
                <li>In progress</li>
                <li>Await feedback</li>
                <li>Done</li>
              </ul>
            </div>
        </div>`;
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

function openOrCloseContextMenu(i, status, action) {
  const cardMenuContainer = document.getElementById(
    `context_menu_${status}_${i}`
  );
  if (action === 'open') {
    cardMenuContainer.classList.remove('d-none');
  } else if (action === 'close') {
    cardMenuContainer.classList.add('d-none');
  }
}
