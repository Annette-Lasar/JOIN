function initTasks() {
  init();
  showAndHideBoxesAccordingToScreenSize();
  checkforAddTaskPage();
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

