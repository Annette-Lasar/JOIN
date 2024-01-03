let todos = [
    {
        'id': 0,
        'title': 'Putzen',
        'category': 'toDo'
    },
    {
        'id': 1,
        'title': 'Kochen',
        'category': 'toDo'
    },
    {
        'id': 2,
        'title': 'Einkaufen',
        'category': 'inProgress'
    },
    {
        'id': 3,
        'title': 'Coden',
        'category': 'awaitFeedback'
    },
    {
        'id': 4,
        'title': 'Lesen',
        'category': 'done'
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
    let toDos = todos.filter(t => t['category'] == 'toDo');
    document.getElementById('toDo').innerHTML = '';
    for (let i = 0; i < toDos.length; i++) {
        const element = toDos[i];
        document.getElementById('toDo').innerHTML += generateTodoHTML(element);
    }
}


function showTasksInProgress() {
    let inProgress = todos.filter(t => t['category'] == 'inProgress');
    document.getElementById('inProgress').innerHTML = '';
    for (let j = 0; j < inProgress.length; j++) {
    const element = inProgress[j];
    document.getElementById('inProgress').innerHTML += generateTodoHTML(element);
    }
}


function showAwaitFeedback() {
    let awaitFeedback = todos.filter(t => t['category'] == 'awaitFeedback');
    document.getElementById('awaitFeedback').innerHTML = '';
    for (let j = 0; j < awaitFeedback.length; j++) {
    const element = awaitFeedback[j];
    document.getElementById('awaitFeedback').innerHTML += generateTodoHTML(element);
    }
}


function showFinishedTasks() {
    let done = todos.filter(t => t['category'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let j = 0; j < done.length; j++) {
    const element = done[j];
    document.getElementById('done').innerHTML += generateTodoHTML(element);
    }
}


function startDragging(id) {
    currentDraggedElement = id;
}


function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
}


function allowDrop(ev) {
    ev.preventDefault();
}


function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    initBoard();
}


function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}


function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

