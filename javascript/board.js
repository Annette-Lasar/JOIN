/* 
 * Guest-Array: muss auch noch auf den Server hoch geladen werden !
 * status ist entweder 'toDo', 'inProgress', 'awaitFeedback' oder 'done'
*/
let tasksGuest = [                                  
    {
        id: 0,
        title: 'Kochwelt Page & Recipe Recommender',
        description: 'Build start page with recipe recommendation...',
        current_category: ['User Story'],                           // Array mit nur einem einzigen Objekt / 1 ausgewählte Category mit Farbe und Titel
        subtasks: ['bla bla bla', 'noch mehr bla bla bla'],         // mehrere Einträge mit mehreren Subtasks
        current_contacts: ['AL', 'SM', 'JH'],                       // mehrere Kontakte mit jeweiligen Farben
        prio: 'urgent',                                             // 'urgent', 'medium' oder 'low' (mit Annette absprechen!)
        status: 'toDo'
    },
    {
        id: 1,
        title: 'Kochen',
        description: 'Etwas Leckeres Kochen für die Familie...',
        current_category: ['Technical Task'],     
        subtasks: ['Gemüse schneiden', 'Küche vorbereiten'], 
        current_contacts: ['BS', 'SM', 'UZ'],   
        prio: 'urgent',         
        status: 'toDo'
    },
    {
        id: 2,
        title: 'Einkaufen',
        description: 'Kartoffeln und Sprudel einkaufen',
        current_category: ['Technical Task'],     
        subtasks: [],
        current_contacts: ['BS', 'SM', 'UZ'],   
        prio: 'low',
        status: 'inProgress'
    },
    {
        id: 3,
        title: 'Coden',
        description: 'Projekt Join fertig stellen und abgeben',
        current_category: ['Technical Task'],     
        subtasks: [],
        current_contacts: ['AS', 'SM', 'JH'],   
        prio: 'urgent',
        status: 'awaitFeedback'
    },
    {
        id: 4,
        title: 'Lesen',
        description: 'Den neuen Hit von Annette lesen und Feedback geben',
        current_category: ['User Story'],     
        subtasks: [],
        current_contacts: ['AS','JH'],   
        prio: 'medium',
        status: 'done'
    }
];

let tasksUser = [];           // falls userLogin, dann hier das JSON-Array des jeweiligen Users runterladen und speichern

let currentDraggedElement;


async function initBoard() {
    let userLogin = localStorage.getItem('userLogin');    // wenn userLogin, dann Task-Array des jeweiligen Users anzeigen; ansonsten Guest-Array anzeigen
    if(userLogin == 'true') {
        todos = await getItem('keyVonAnnettesTask-Array');
    } 
    showToDos();
    showTasksInProgress();
    showAwaitFeedback();
    showFinishedTasks();
}


function showToDos() {
    let toDos = tasksGuest.filter(t => t['status'] == 'toDo');
    document.getElementById('to_Do').innerHTML = '';
    for (let i = 0; i < toDos.length; i++) {
        const element = toDos[i];
        document.getElementById('to_Do').innerHTML += generateToDoHTML(element);
    }
}


function showTasksInProgress() {
    let inProgress = tasksGuest.filter(t => t['status'] == 'inProgress');
    document.getElementById('in_Progress').innerHTML = '';
    for (let i = 0; i < inProgress.length; i++) {
        const element = inProgress[i];
        document.getElementById('in_Progress').innerHTML += generateToDoHTML(element);
    }
}


function showAwaitFeedback() {
    let awaitFeedback = tasksGuest.filter(t => t['status'] == 'awaitFeedback');
    document.getElementById('await_Feedback').innerHTML = '';
    for (let i = 0; i < awaitFeedback.length; i++) {
        const element = awaitFeedback[i];
        document.getElementById('await_Feedback').innerHTML += generateToDoHTML(element);
    }
}


function showFinishedTasks() {
    let done = tasksGuest.filter(t => t['status'] == 'done');
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
function moveTo(status) {
    tasksGuest[currentDraggedElement]['status'] = status;
    // Hier eine Funktion einfügen, die das geänderte JSON-Array wieder an den Server sendet ( await setItem(........) )
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

