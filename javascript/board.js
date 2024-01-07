// falls User-Login, dann das JSON-Array des jeweiligen Users vom Server hier rein laden; ansonsten das Array 'guestsTasks' vom Server holen
// egal welche Login-Art: Die Arrays werden immer in tasks[] geladen
let tasks = [];     

let currentDraggedElement;


async function initBoard() {
    let userLogin = localStorage.getItem('userLogin');    
    if(userLogin == 'true') {                                    // User-Login hat stattgefunden
        let userEmail = localStorage.getItem('userEmail');       // zuerst herausfinden, welcher User sich angemeldet hat (in localStorage vermerkt)
        let user = users.find(u => u.email == userEmail); 
        tasks = JSON.parse(await getItem(user['tasks']));        // Task-Array dieses Users in tasks[] laden
    } else {
        tasks = JSON.parse(await getItem('guestTasks'));         // GuestLogin: wir holen das Gast-Array vom Server (key: 'guestTasks')
    }
    showToDos();
    showTasksInProgress();
    showAwaitFeedback();
    showFinishedTasks();
}


function showToDos() {
    let toDos = tasks.filter(t => t['status'] == 'toDo');
    document.getElementById('to_Do').innerHTML = '';
    for (let i = 0; i < toDos.length; i++) {
        const element = toDos[i];
        document.getElementById('to_Do').innerHTML += generateToDoHTML(element);
    }
}


function showTasksInProgress() {
    let inProgress = tasks.filter(t => t['status'] == 'inProgress');
    document.getElementById('in_Progress').innerHTML = '';
    for (let i = 0; i < inProgress.length; i++) {
        const element = inProgress[i];
        document.getElementById('in_Progress').innerHTML += generateToDoHTML(element);
    }
}


function showAwaitFeedback() {
    let awaitFeedback = tasks.filter(t => t['status'] == 'awaitFeedback');
    document.getElementById('await_Feedback').innerHTML = '';
    for (let i = 0; i < awaitFeedback.length; i++) {
        const element = awaitFeedback[i];
        document.getElementById('await_Feedback').innerHTML += generateToDoHTML(element);
    }
}


function showFinishedTasks() {
    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let i = 0; i < done.length; i++) {
        const element = done[i];
        document.getElementById('done').innerHTML += generateToDoHTML(element);
    }
}


// diese Funktion rendert die einzelnen Tasks auf das Board ( in Bearbeitung )
function generateToDoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
              <div>${element['current_category']}</div>
              <div class="toDo-title">${element['title']}</div>
              <div class="toDo-description">${element['description']}</div>         
              <div>${element['subtasks'].length}/2 Subtasks</div>
              <div class='contacts-and-prio'>
                <div>${element['current_contacts']}</div>
                <div>${element['prio']}</div>
              </div>
            </div>`;
}


function startDragging(id) {
    currentDraggedElement = id;
}


// status ist entweder 'toDo', 'inProgress', 'awaitFeedback' oder 'done' (siehe board.html)
async function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    let userLogin = localStorage.getItem('userLogin');    
    if(userLogin == 'true') {                                    
        let userEmail = localStorage.getItem('userEmail');       
        let user = users.find(u => u.email == userEmail); 
        await setItem(user['tasks'], JSON.stringify(tasks));      
    } else {
        await setItem('users', JSON.stringify(users));         
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

