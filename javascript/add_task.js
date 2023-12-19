

let subTasks = [];

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
    bigScreen.style.display = 'none';
  } else {
    prioSmallScreen.style.display = 'none';
    dueDateSmallScreen.style.display = 'none';
    categorySmallScreen.style.display = 'none';
    subTasksSmallScreen.style.display = 'none';
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

function showCancelAndAcceptSubtask() {
  const CLOSE_AND_CHECK_WRAPPER = document.getElementById(
    'close_and_check_wrapper_big'
  );
  const SUBTASK_PLUS_BIG = document.getElementById('subtask_plus_big');
  CLOSE_AND_CHECK_WRAPPER.classList.remove('d-none');
  SUBTASK_PLUS_BIG.classList.add('d-none');
}

function clearSubtask() {
  document.getElementById('sub_tasks_big').value = '';
  hideCancelAndAcceptSubtask();
}

function hideCancelAndAcceptSubtask() {
  const CLOSE_AND_CHECK_WRAPPER = document.getElementById(
    'close_and_check_wrapper_big'
  );
  const SUBTASK_PLUS_BIG = document.getElementById('subtask_plus_big');
  CLOSE_AND_CHECK_WRAPPER.classList.add('d-none');
  SUBTASK_PLUS_BIG.classList.remove('d-none');
}

function addSubtask() {
  const SUBTASK_INPUT_BOX = document.getElementById('sub_tasks_big');
  const SUBTASK_CONTAINER_BIG = document.getElementById('subtask_container_big');
  SUBTASK_CONTAINER_BIG.innerHTML = '';
  
  if (SUBTASK_INPUT_BOX.value !== '') {
    console.log('Input Value:', SUBTASK_INPUT_BOX.value);
    subTasks.push(SUBTASK_INPUT_BOX.value);
  }

  renderAndInsertSubtasks();
  document.getElementById('sub_tasks_big').value = '';
  clearSubtask();
}

function deleteSubtask(i) {
  subTasks.splice(i, 1);
  renderAndInsertSubtasks();
}

function renderAndInsertSubtasks() {
  const SUBTASK_CONTAINER_BIG = document.getElementById('subtask_container_big');
  SUBTASK_CONTAINER_BIG.innerHTML = renderSubtasks();
}

function generateSubtaskHTML(i, subtask) {
  return /* html */ `
    <li id="subtask_entry${i}">${subtask}
      <div class="subtask-list-wrapper">
        <img src="../icons/edit_dark.svg">
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



