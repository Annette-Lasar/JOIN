let todos = [                                  // JSON-Array nur beispielhaft; wird später ersetzt, indem man das JSON-Array mit den Tasks vom Server lädt
    {
        'id': 0,
        'title': 'Putzen',
        'status': 'toDo'
    },
    {
        'id': 1,
        'title': 'Kochen',
        'status': 'toDo'
    },
    {
        'id': 2,
        'title': 'Einkaufen',
        'status': 'inProgress'
    },
    {
        'id': 3,
        'title': 'Coden',
        'status': 'awaitFeedback'
    },
    {
        'id': 4,
        'title': 'Lesen',
        'status': 'done'
    }
];

let currentDraggedElement;


function initBoard() {
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


function generateToDoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}


function startDragging(id) {
    currentDraggedElement = id;
}


// status ist entweder toDo, inProgress, awaitFeedback oder done (siehe board.html)
function moveTo(status) {
    todos[currentDraggedElement]['status'] = status;
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

