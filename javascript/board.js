/* 
 * JSON-Array nur beispielhaft; wird später ersetzt, indem man das JSON-Array mit den Tasks vom Server lädt ( siehe function initBoard() )
 * status ist entweder 'toDo', 'inProgress', 'awaitFeedback' oder 'done'
*/
let todos = [                                  
    {
        id: 0,
        title: 'Kochwelt Page & Recipe Recommender',
        description: 'Build start page with recipe recommendation...',
        current_category: ['User Story'],                           // Array mit nur einem einzigen Objekt / 1 ausgewählte Category mit Farbe und Titel
        subtasks: ['bla bla bla', 'noch mehr bla bla bla'],         // mehrere Einträge mit mehreren Subtasks
        current_contacts: ['AL', 'SM', 'JH'],                       // mehrere Kontakte
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

let currentDraggedElement;


function initBoard() {
    // hier Funktion einfügen, die das Array mit den ToDos/Tasks vom Server lädt ( await getItem(.....) )
    showToDos();
    showTasksInProgress();
    showAwaitFeedback();
    showFinishedTasks();
}


function showToDos() {
    let toDos = todos.filter(t => t['status'] == 'toDo');
    document.getElementById('to_Do').innerHTML = '';
    for (let i = 0; i < toDos.length; i++) {
        const element = toDos[i];
        document.getElementById('to_Do').innerHTML += generateToDoHTML(element);
    }
}


function showTasksInProgress() {
    let inProgress = todos.filter(t => t['status'] == 'inProgress');
    document.getElementById('in_Progress').innerHTML = '';
    for (let j = 0; j < inProgress.length; j++) {
        const element = inProgress[j];
        document.getElementById('in_Progress').innerHTML += generateToDoHTML(element);
    }
}


function showAwaitFeedback() {
    let awaitFeedback = todos.filter(t => t['status'] == 'awaitFeedback');
    document.getElementById('await_Feedback').innerHTML = '';
    for (let j = 0; j < awaitFeedback.length; j++) {
        const element = awaitFeedback[j];
        document.getElementById('await_Feedback').innerHTML += generateToDoHTML(element);
    }
}


function showFinishedTasks() {
    let done = todos.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let j = 0; j < done.length; j++) {
        const element = done[j];
        document.getElementById('done').innerHTML += generateToDoHTML(element);
    }
}


// diese Funktion rendert die einzelnen Tasks auf das Board ( in Bearbeitung )
function generateToDoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
              <div>${element['current_category']}</div>
              <div>${element['title']}</div>
              <div>${element['description']}</div>
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
    todos[currentDraggedElement]['status'] = status;
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

