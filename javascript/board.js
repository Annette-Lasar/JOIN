// falls User-Login, dann das JSON-Array des jeweiligen Users vom Server hier rein laden; ansonsten das Array 'guestTasks' vom Server holen
// egal welche Login-Art: Die Arrays werden immer in das Array tasks[] geladen; danach wird das Array tasks[] gerendert
let tasks = [];
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
    renderTaskContacts(i, element, status);
  }
}

function truncateSentence(sentence, wordsCount) {
    // Teile den Satz in Wörter auf: 
    const words = sentence.split(' ');
    // Überprüfe, ob die Anzahl der Wörter im Satz größer oder gleich der gewünschten Anzahl ist
    if (words.length <= wordsCount) {
      // Wenn der Satz weniger oder gleich viele Wörter hat wie gewünscht, gib den Originalsatz zurück
      return sentence;
    } else {
      // Andernfalls extrahiere die ersten N Wörter und füge drei Punkte hinzu
      const truncatedSentence = words.slice(0, wordsCount).join(' ') + ' ...';
      return truncatedSentence;
    }
  }

  function calculateSubtaskPercentage(element) {
    if (element.subtasks.length > 0) {
        return completedSubtasks / element.subtasks.length * 100;
    } else {
        return 0;
    }
    
  }


// Kommentar: Hier die Berechnung für den Overflow-Indikator einfügen!!
function renderTaskContacts(i, element, status) {
  const taskContactContainer = document.getElementById(
    `task_contact_${status}_${i}`
  );
  taskContactContainer.innerHTML = '';
  for (let j = 0; j < element.current_contacts.length; j++) {
    taskContactContainer.innerHTML += generateTaskContactHTML(j, element);
  }
}

// Kommentar: background-color durch Variable ersetzen
function generateTaskContactHTML(j, element) {
  const [firstName, lastName] = element.current_contacts[j].name.split(' ');
  return /* html */ `
        <div class="initials-icon" style="background-color: ${
          element.current_contacts[j].color
        }">${firstName[0]}${lastName ? lastName[0] : ''}</div>
    `;
}

// Kommentar: style-Attribute für category durch Variablen ersetzen!!
// Kommentar: Anzahl der erledigten Subtasks rendern
function generateToDoHTML(i, element, status, newTruncatedSentence, completedSubtasksInPercent) {
  return /* html */ `
          <div draggable="true" oncontextmenu="openOrCloseContextMenu(${i}, '${status}', 'open')" ondragstart="startDragging(${element['id']})" class="todo">
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
