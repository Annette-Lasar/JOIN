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
    if(userLogin == 'true') {                                    
        let userEmail = localStorage.getItem('userEmail');       
        userEmail = userEmail.replace(/"/g, '');                 
        users = JSON.parse(await getItem('users'));              
        let user = users.find(u => u.email === userEmail);       
        if(user) {                                               
          if(user['tasks'].length > 0) {                         
            tasks = JSON.parse(await getItem(user['tasks']));        
          }                   
        }
    } else {
        tasks = JSON.parse(await getItem('guestTasks'));         
    }
}


function showTasksOnBoard(status) {
    let filtered = tasks.filter(t => t['status'] == status);
    document.getElementById(status).innerHTML = '';
    for (let i = 0; i < filtered.length; i++) {
        const element = filtered[i];
        document.getElementById(status).innerHTML += generateToDoHTML(element);
    }
}


// diese Funktion rendert die einzelnen Tasks auf das Board
function generateToDoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
              <div>${element['current_category']}</div>
              <div class="toDo-title">${element['title']}</div>
              <div class="toDo-description">${element['description']}</div>         
              <div>${element['subtasks'].length}/2 Subtasks</div>
              <div class='contacts-and-prio'>
                <div>${element['current_contacts']}</div>
                <div>${element['current_prio']}</div>
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
    if(userLogin == 'true') {                                    
        let userEmail = localStorage.getItem('userEmail');  
        userEmail = userEmail.replace(/"/g, '');     
        let user = users.find(u => u.email == userEmail); 
        if(user) {
            await setItem(user['tasks'], JSON.stringify(tasks)); 
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

