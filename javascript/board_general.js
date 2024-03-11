
/**
 * This function closes a dropdown list if the user clicks outside the list.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {MouseEvent} event - This is a click event.
 */
function clickOutsideDropdown(i, event) {
    const clickedElement = event.target.closest('.contact-list-element');
    if (clickedElement == null) {
      closeDropdownList(
        `edit_contact_list${i}`,
        `select_arrow_contacts${i}`,
        event
      );
    }
  }
  
  /**
   * This function caches a dragged element's id in an array to be used later.
   * @param {string} id - A dragged element's id. 
   */
  function startDragging(id) {
    currentDraggedElement = id;
  }
  
  /**
   * This function moves a tasks card into another list on the kanban board.
   * @param {string} status - This is a task's status like 'toDo', 'inProgress',
   * 'awaitFeedback' or 'done'.
   */
  async function moveTo(status) {
    tasks[currentDraggedElement].status = '';
    tasks[currentDraggedElement].status = status;
    sendTasksToServer();
    await loadTasksUserOrGuest();
    await loadContactsUserOrGuest();
    showTasksOnBoard();
  }
  
  /**
   * This function moves a task card to a new list by clicking on a card's context menu.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {string} status - This is a task's status like 'toDo', 'inProgress',
   * 'awaitFeedback' or 'done'.
   * @param {MouseEvent} event - This is a click event. It's needed to stop event bubbling.
   */
  async function moveToNewList(i, status, event) {
    event.stopPropagation();
    currentTaskCard = document.getElementById(`taskCard_${i}`);
    let cardStatus = tasks[i].status;
    if (status !== cardStatus) {
      tasks[i].status = status;
      sendTasksToServer();
      await loadTasksUserOrGuest();
      await loadContactsUserOrGuest();
      showTasksOnBoard();
    }
  }
  
  /**
   * This function deletes a task completely. The user gets a warning for this process
   * is irreversible.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  async function deleteTask(i) {
    tasks.splice(i, 1);
    openOrCloseAlertContainer('confirm_container', 'close');
    await sendTasksToServer();
    await loadTasksUserOrGuest();
    await loadContactsUserOrGuest();
    location.reload();
  }
  
  /**
   * This function removes the highlight from a dragging area on the board
   * after the dragging process is over.
   * @param {string} id - This is the dragging area's id.
   */
  function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
  }
  
  /**
   * This function drops a card into the new list on the board.
   * @param {event} ev - This is used to prevent default reaction.
   */
  function allowDrop(ev) {
    ev.preventDefault();
  }
  
  /**
   * This function is used to highlight a dragging area.
   * @param {string} id - This is the dragging area's id.
   */
  function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
  }
  
  /**
   * This function opens a card's context menu by clicking on three dots
   * in the top right corner of a card. The context menu enables the user
   * to move the clicked card into another list.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {string} status - This is a task's status like 'toDo', 'inProgress',
   * 'awaitFeedback' or 'done'.
   * @param {MouseEvent} event - This is a click event. 
   */
  function openCardContextMenu(i, status, event) {
    event.stopPropagation();
    const cardMenuContainer = document.getElementById(`context_menu_${i}`);
    const listItemInfo = getListItemInfo();
    for (const listStatus of Object.keys(listItemInfo)) {
      const listItemElement = document.getElementById(`${listStatus}_${i}`);
      if (status === listStatus) {
        listItemElement.style.pointerEvents = 'none';
        listItemElement.style.color = '#d6d6d6';
      }
    }
    cardMenuContainer.classList.remove('d-none');
  }
  
  /**
   * This function gets the lists' ids for moving a card to another list.
   * @returns It returns a JSON with the list ids.
   */
  function getListItemInfo() {
    let listIds = {
      toDo: 1,
      inProgress: 2,
      awaitFeedback: 3,
      done: 4,
    };
    return listIds;
  }
  
  /**
   * This function closes the card context menu.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @param {MouseEvent} event - This is a click event.
   */
  function closeCardContextMenu(i, event) {
    event.stopPropagation();
    const contextMenuContainer = document.getElementById(`context_menu_${i}`);
    contextMenuContainer.classList.add('d-none');
  }
  
  
  /**
   * This function opens or closes a container with the task index, the container id
   * and the action given as parameters.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {string} containerId - This is the id of the container to be opened or closed.
   * @param {string} action - This is the action to be executed, either 'open' or 'close'.
   */
  function openOrCloseContainer(i, containerId, action) {
    const cardMenuContainer = document.getElementById(containerId);
    if (action === 'open') {
      cardMenuContainer.classList.remove('d-none');
      renderTaskDetailView(i);
      checkForCurrentSubtaskStatus(i);
      updateProgressBar(i, tasks[i]);
      updateCompletedTasks(i, tasks[i]);
      document.body.style.overflow = 'hidden';
    } else if (action === 'close') {
      const editTaskWrapper = document.getElementById(`edit_task_wrapper${i}`);
      editTaskWrapper.classList.remove('edit-task-wrapper');
      cardMenuContainer.classList.add('d-none');
      updateProgressBarAndCompletedTasks(i, tasks[i]);
      document.body.style.overflow = 'visible';
    }
  }
  
  /**
   * This function checks if a subtask has already been completed or not.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function checkForCurrentSubtaskStatus(i) {
    const subtasks = tasks[i].subtasks;
    for (let j = 0; j < subtasks.length; j++) {
      const oneSubtask = subtasks[j];
      const individualCheckBox = document.getElementById(
        `individual_subtask_checkbox_${i}_${j}`
      );
      if (oneSubtask.checked_status) {
        individualCheckBox.checked = true;
      } else {
        individualCheckBox.checked = false;
      }
    }
  }
  
  /**
   * This function renders a detail view of a task.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function renderTaskDetailView(i) {
    const cardDetailContainer = document.getElementById(
      `detail_task_wrapper_${i}`
    );
    cardDetailContainer.innerHTML = generateDetailViewHTML(i, tasks[i]);
    renderContactsInsideCard(i, tasks[i]);
    renderSubtasksDetailView(i, tasks[i]);
    checkForCurrentSubtaskStatus(i);
    getFilteredDueDate(i, tasks[i]);
  }
  
  /**
   * This function opens an overlay container which enables the user to 
   * create a new task directly in the list that was clicked.
   * @param {string} status - This is a task's status like 'toDo', 'inProgress',
   * 'awaitFeedback' or 'done'.
   */
  function openAddTaskToList(status) {
    const addTaskOverlayContainer = document.getElementById('add_task_overlay');
    addTaskOverlayContainer.classList.remove('d-none');
    showAndHideBoxesAccordingToScreenSize();
    renderCategories();
    renderContacts();
    addCheckboxEventListeners();
    setStandardDateToToday('task_due_date_small');
    setStandardDateToToday('task_due_date_big');
    renderCreateTaskButtons(status);
  }
  
  /**
   * This function renders two create task-buttons in order to clear all input
   * fields or to create a new task.
   * @param {string} status - This is a task's status like 'toDo', 'inProgress',
   * 'awaitFeedback' or 'done'.
   */
  function renderCreateTaskButtons(status) {
    const createTaskWrapper = document.getElementById('create_task_wrapper');
    createTaskWrapper.innerHTML = generateCreateTaskButtonsHTML(status);
  }
  
  /**
   * This function closes the overlay that adds a new task to a certain list
   */
  function closeAddTaskToList(event) {
    event.stopPropagation();
    const addTaskOverlayContainer = document.getElementById('add_task_overlay');
    addTaskOverlayContainer.classList.add('d-none');
  }