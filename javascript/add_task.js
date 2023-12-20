let subTasks = [];
let updatedSubtask;
const SUBTASK_CONTAINER_BIG = document.getElementById('subtask_container_big');
const SUBTASK_CONTAINER_SMALL = document.getElementById(
  'subtask_container_small'
);

function initTasks() {
  init();
  showAndHideBoxesAccordingToScreenSize();
  checkforAddTaskPage();
  renderSubtasks();
}

/**
 * Toggles dropdown lists on add tasks page by displaying all available options
 * of the dropdown list and rotating the arrow 180 deg
 * Shows an option to add a new task category resp a new contact
 * @param {string} idContainer - represents the container that holds the list of options
 * @param {string} idArrow  - represents the img element with the arrow
 */
function toggleDropdownLists(idContainer, idArrow) {
  const CATEGORY_List = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_List.classList.toggle('show');
  SELECT_ARROW.classList.toggle('turn');
}

function showAndHideBoxesAccordingToScreenSize() {
  let prioSmallScreen = document.getElementById('prio_small_screen');
  let dueDateSmallScreen = document.getElementById('due_date_small_screen');
  let categorySmallScreen = document.getElementById('category_small_screen');
  let subTasksSmallScreen = document.getElementById('sub_tasks_small_screen');
  let bigScreen = document.getElementById('form_big_screen');
  let windowSize = window.innerWidth;

  if (windowSize < 800) {
    prioSmallScreen.style.display = 'block';
    dueDateSmallScreen.style.display = 'flex';
    categorySmallScreen.style.display = 'block';
    subTasksSmallScreen.style.display = 'flex';
    SUBTASK_CONTAINER_SMALL.style.display = 'block';
    bigScreen.style.display = 'none';
  } else {
    prioSmallScreen.style.display = 'none';
    dueDateSmallScreen.style.display = 'none';
    categorySmallScreen.style.display = 'none';
    subTasksSmallScreen.style.display = 'none';
    SUBTASK_CONTAINER_SMALL.style.display = 'none';
    bigScreen.style.display = 'block';
  }
}

function checkforAddTaskPage() {
  let url = window.location.href;

  if (url.endsWith('add_task.html')) {
    document.addEventListener('DOMContentLoaded', function () {
      showAndHideBoxesAccordingToScreenSize(); // Initial check
      window.addEventListener('resize', showAndHideBoxesAccordingToScreenSize);
    });
  }
}

checkforAddTaskPage();

function showCancelAndAcceptSubtask(wrapperId, plusIconId) {
  const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);
  const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
  CLOSE_AND_CHECK_WRAPPER.classList.remove('d-none');
  SUBTASK_PLUS_ICON.classList.add('d-none');
}

function clearSubtask(inputId, wrapperId, plusIconId) {
  const SUBTASK_INPUT_BOX = document.getElementById(inputId);
  const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
  const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);
  SUBTASK_INPUT_BOX.value = '';
  hideCancelAndAcceptSubtask(CLOSE_AND_CHECK_WRAPPER, SUBTASK_PLUS_ICON);
}

function hideCancelAndAcceptSubtask(
  CLOSE_AND_CHECK_WRAPPER,
  SUBTASK_PLUS_ICON
) {
  CLOSE_AND_CHECK_WRAPPER.classList.add('d-none');
  SUBTASK_PLUS_ICON.classList.remove('d-none');
}

function addSubtask(inputId, wrapperId, plusIconId) {
  const SUBTASK_INPUT_BOX = document.getElementById(inputId);
  const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
  const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);
  SUBTASK_CONTAINER_BIG.innerHTML = '';
  SUBTASK_CONTAINER_SMALL.innerHTML = '';

  if (SUBTASK_INPUT_BOX.value !== '') {
    subTasks.push(SUBTASK_INPUT_BOX.value);
  }

  renderAndInsertSubtasks();
  SUBTASK_INPUT_BOX.value = '';
  hideCancelAndAcceptSubtask(CLOSE_AND_CHECK_WRAPPER, SUBTASK_PLUS_ICON);
}

function deleteSubtask(i) {
  subTasks.splice(i, 1);
  renderAndInsertSubtasks();
}

function renderAndInsertSubtasks() {
  SUBTASK_CONTAINER_BIG.innerHTML = renderSubtasks();
  SUBTASK_CONTAINER_SMALL.innerHTML = renderSubtasks();
}

function generateSubtaskHTML(i, subtask) {
  return /* html */ `
    <li id="subtask_entry${i}">${subtask}
      <div class="subtask-list-wrapper">
        <img onclick="editSubtask(${i})" src="../icons/edit_dark.svg">
        <div class="subtask-separator-line"></div>
        <img onclick="deleteSubtask(${i})" src="../icons/delete.svg">
      </div>
    </li>
  `;
}

function renderSubtasks() {
  let html = `<ul id="subtask_unordered_list_big" class="subtask-unordered-list">`;
  for (let i = 0; i < subTasks.length; i++) {
    let subtask = subTasks[i];
    html += generateSubtaskHTML(i, subtask);
  }
  html += `</ul>`;
  return html;
}

function editSubtask(i) {
  let subtaskElement = document.getElementById(`subtask_entry${i}`);
  let originalSubtaskElement = subtaskElement.textContent.trim();

  // Erstelle ein neues input-Element für die Bearbeitung
  let newInput = document.createElement('input');
  newInput.classList.add('custom-input-subtask');
  newInput.id = `subtask_input${i}`;
  newInput.value = originalSubtaskElement;
  subtaskElement.parentNode.replaceChild(newInput, subtaskElement);

  // Füge ein Event-Handler für das Verlassen des Textfelds hinzu
  newInput.addEventListener('blur', function () {
    updatedSubtask = newInput.value;
    subTasks[i] = updatedSubtask;

    // Erstelle ein neues div-Element für Icons und Text
    let newDiv = document.createElement('div');
    newDiv.classList.add('subtask-list-wrapper');

    // Füge das Bearbeiten-Icon hinzu
    let editIcon = document.createElement('img');
    editIcon.src = '../icons/edit_dark.svg';
    editIcon.addEventListener('click', () => editSubtask(i));
    newDiv.appendChild(editIcon);

    // Füge eine Trennlinie hinzu
    let separatorLine = document.createElement('div');
    separatorLine.classList.add('subtask-separator-line');
    newDiv.appendChild(separatorLine);

    // Füge das Löschen-Icon hinzu
    let deleteIcon = document.createElement('img');
    deleteIcon.src = '../icons/delete.svg';
    deleteIcon.addEventListener('click', () => deleteSubtask(i));
    newDiv.appendChild(deleteIcon);

    // Erstelle ein neues li-Element für den editierten Text
    let newSubtaskElement = document.createElement('li');
    newSubtaskElement.id = `subtask_entry${i}`;
    newSubtaskElement.classList.add('subtask-list-item');
    newSubtaskElement.textContent = updatedSubtask;
    newSubtaskElement.appendChild(newDiv);

    // Ersetze das ursprüngliche Element durch das bearbeitete Element
    newInput.parentNode.replaceChild(newSubtaskElement, newInput);
    document.body.focus();
  });

  // Fokussiere das Textfeld für eine bessere Benutzererfahrung
  /* newInput.focus(); */


setTimeout(() => {
  newInput.focus();
}, 20);
}


/* let isEditingSubtask = false; // Neue Variable für den Fokusstatus

function editSubtask(i) {
  if (isEditingSubtask) return; // Wenn bereits ein Inputfeld aktiv ist, breche ab

  isEditingSubtask = true; // Setze den Fokusstatus auf true

  let subtaskElement = document.getElementById(`subtask_entry${i}`);
  let originalSubtaskElement = subtaskElement.textContent.trim();
  console.log(originalSubtaskElement);

  // Erstelle ein neues li-Element für den editierten Text
  let newSubtaskElement = document.createElement('li');
  newSubtaskElement.id = `subtask_entry${i}`;
  newSubtaskElement.classList.add('subtask-list-item');

  // Erstelle ein neues input-Element für die Bearbeitung
  let newInput = document.createElement('input');
  newInput.classList.add('custom-input-subtask');
  newInput.id = `subtask_input${i}`;
  newInput.value = originalSubtaskElement;

  // Erstelle ein neues div-Element für Icons und Text
  let newDiv = document.createElement('div');
  newDiv.classList.add('subtask-list-wrapper');

  // Füge das Bearbeiten-Icon hinzu
  let editIcon = document.createElement('img');
  editIcon.src = '../icons/edit_dark.svg';
  editIcon.addEventListener('click', () => editSubtask(i));
  newDiv.appendChild(editIcon);

  // Füge eine Trennlinie hinzu
  let separatorLine = document.createElement('div');
  separatorLine.classList.add('subtask-separator-line');
  newDiv.appendChild(separatorLine);

  // Füge das Löschen-Icon hinzu
  let deleteIcon = document.createElement('img');
  deleteIcon.src = '../icons/delete.svg';
  deleteIcon.addEventListener('click', () => deleteSubtask(i));
  newDiv.appendChild(deleteIcon);

  // Füge das div-Element zum li-Element hinzu
  newSubtaskElement.appendChild(newDiv);

  // Füge das input-Element zum li-Element hinzu
  newSubtaskElement.appendChild(newInput);

  // Setze den ursprünglichen Text als Inhalt des li-Elements
  newSubtaskElement.textContent = originalSubtaskElement;

  // Ersetze das ursprüngliche Element durch das bearbeitete Element
  subtaskElement.parentNode.replaceChild(newSubtaskElement, subtaskElement);

  // Fokussiere das Textfeld für eine bessere Benutzererfahrung
  newInput.focus();

  // Füge ein Event-Handler für das Verlassen des Textfelds hinzu
  newInput.addEventListener('blur', function() {
    updatedSubtask = newInput.value;
    subTasks[i] = updatedSubtask;

    // ... (Ihr restlicher Code bleibt unverändert)

    // Setze den Fokusstatus auf false
    isEditingSubtask = false;
  });
} */

