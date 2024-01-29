/**
 * This function calls all other functions necessary to edit a task.
 * @param {number} i - This is the index of a task in the array tasks.
 */
function editTask(i) {
    checkForCurrentSubtaskStatus(i);
    countCheckedSubtasks(tasks[i].subtasks);
    preserveOriginalTask(tasks[i]);
    replaceCategory(i);
    addClassToContainer(i);
    editTitle(i, tasks[i]);
    editDescription(i, tasks[i]);
    editDueDate(i, tasks[i]);
    editPriority(i, tasks[i]);
    editContacts(i);
    makeSubtasksEditable(i, tasks[i]);
    createOkButton(i);
  }
  
  /**
   * This function updates the number of completed subtasks. 
   * @param {Array} subtasksArray - This is the subarray subtasks in the array tasks.
   */
  function countCheckedSubtasks(subtasksArray) {
    subtasksArray.reduce((count, subtask) => {
      return count + (subtask.checked_status === true ? 1 : 0);
    }, 0);
  }
  
  /**
   * This function clones the original task that can be restored in case the user
   * wants to abort the act of editing a task.
   * @param {Object} oneTask - This is a JSON representing one task in the array tasks. 
   */
  function preserveOriginalTask(oneTask) {
    const clonedTask = { ...oneTask };
    currentlyEditedTask[0] = clonedTask;
  }
  
  /**
   * This function replaces the category container by a simple close button.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function replaceCategory(i) {
    const closeBox = document.getElementById(`category_and_close_wrapper${i}`);
    closeBox.innerHTML = '';
    closeBox.innerHTML = generateCloseIcon(i);
  }
  
  /**
   * This function adds a class to a container that shall only be available in the 
   * editing mode. It gets a scrollbar if there is an overflow of its content.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function addClassToContainer(i) {
    const editTaskWrapper = document.getElementById(`edit_task_wrapper${i}`);
    editTaskWrapper.classList.add('edit-task-wrapper');
  }
  
  /**
   * This function enables the user to edit a task's title.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} oneTask - This is a JSON representing one task in the array tasks.
   */
  function editTitle(i, oneTask) {
    const taskTitleBox = document.getElementById(`detail_title${i}`);
    taskTitleBox.innerHTML = '';
    taskTitleBox.innerHTML = generateEditTitleHTML(i, oneTask);
  }
  
  /**
   * This function saves a task's edited title and shows a warning if the input field
   * remains empty.
   * @param {number} i - This is the index of one task in the array tasks. 
   */
  function updateEditedTitle(i) {
    const editTitleInput = document.getElementById(`edited_task_title_${i}`);
    const instructionBox = document.getElementById(`title_instruction_text_${i}`);
    let newTitle = editTitleInput.value.trim();
    if (newTitle !== '') {
      tasks[i].title = newTitle;
      editTitleInput.classList.remove('warning');
      instructionBox.classList.remove('red');
    } else {
      showTitleWarning(i);
    }
  }
  
  /**
   * This function shows a warning if the title's input field remains empty.
   * @param {number} i - This is the index of one task in the array tasks.
   */
  function showTitleWarning(i) {
    const editTitleInput = document.getElementById(`edited_task_title_${i}`);
    const instructionBox = document.getElementById(`title_instruction_text_${i}`);
    editTitleInput.classList.add('warning');
    instructionBox.classList.add('red');
  }
  
  /**
   * This function enables the user to edit a task's description.
   * @param {number} i - This is the index of one task in the array tasks.
   * @param {Object} oneTask - This is a JSON representing one task in the array tasks.
   */
  function editDescription(i, oneTask) {
    const taskDescriptionBox = document.getElementById(`detail_description${i}`);
    taskDescriptionBox.innerHTML = '';
    taskDescriptionBox.innerHTML = generateEditDescriptionHTML(i, oneTask);
  }
  
  /**
   * This function updates a task's edited description.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function updateEditedDescription(i) {
    const editDescriptionInput = document.getElementById(
      `edited_task_description${i}`
    );
    let newDescription = editDescriptionInput.value;
    tasks[i].description = newDescription;
  }
  
  /**
   * This function enables the user to edit a task's due date. 
   * @param {number} i - This is the index of a task in the array tasks. 
   * @param {Object} oneTask - This is a JSON representing a task in the array tasks.
   */
  function editDueDate(i, oneTask) {
    const dueDateBox = document.getElementById(`current_due_date_${i}`);
    let minimumDueDate = standardDateOfToday();
    dueDateBox.innerHTML = '';
    dueDateBox.innerHTML = generateEditDueDateHTML(i, oneTask, minimumDueDate);
  }
  
  /**
   * This function gets today's date in the format yyyy-mm-dd.
   * @returns - Today's date is returned.
   */
  function standardDateOfToday() {
    return new Date().toISOString().split('T')[0];
  }
  
  /**
   * This function updates a task's edited due date.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function updateEditedDueDate(i) {
    const editDueDateInput = document.getElementById(`edited_task_due_date${i}`);
    const instructionBox = document.getElementById(
      `due_date_instruction_text${i}`
    );
    let newDueDate = editDueDateInput.value;
    if (newDueDate !== '') {
      tasks[i].current_due_date = newDueDate;
      editDueDateInput.classList.remove('warning');
      instructionBox.classList.remove('red');
    } else {
      showDueDateWarning(i);
    }
  }
  
  /**
   * This function creates a warning if the input field type 'date' is empty.
   * @param {number} i - This is the index of a task in the array tasks. 
   */
  function showDueDateWarning(i) {
    const editDueDateInput = document.getElementById(`edited_task_due_date${i}`);
    const instructionBox = document.getElementById(
      `due_date_instruction_text${i}`
    );
    editDueDateInput.classList.add('warning');
    instructionBox.classList.add('red');
  }
  
  /**
   * This function enables the user to edit a task's priority.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} oneTask - This is a JSON representing a task in the array tasks.
   */
  function editPriority(i, oneTask) {
    const priorityBox = document.getElementById(`task_priority_wrapper${i}`);
    priorityBox.innerHTML = '';
    priorityBox.innerHTML = generatePriorityButtonsHTML(i);
    changePrioStatusEdit(i, oneTask.current_prio);
  }
  
  /**
   * This function updates a task's priority status.
   * @param {number} i - This is the index of a tasks in the array tasks.
   * @param {string} buttonType - This is a prio button's type like 'urgent', 'medium' or 'low'.
   * @param {Boolean} isActive - This is true or false. 
   */
  function updateButtonsEdit(i, buttonType, isActive) {
    const prioButton = document.getElementById(`prio_button_${buttonType}_${i}`);
    if (isActive) {
      prioButton.classList.add(`prio-marked-${buttonType}`);
    } else {
      prioButton.classList.remove(`prio-marked-${buttonType}`);
    }
  }
  
  /**
   * This function changes a task's priority status. 
   * @param {number} i - This is the index of a task in the array tasks. 
   * @param {string} prioStatus - This is a task's priority 'urgent', 'medium' or 'low'.
   */
  function changePrioStatusEdit(i, prioStatus) {
    const buttonTypes = ['urgent', 'medium', 'low'];
    buttonTypes.forEach((type) => updateButtonsEdit(i, type, false));
    updateButtonsEdit(i, prioStatus, true);
    if (prioStatus === 'urgent') {
      tasks[i].current_prio = prioStatus;
    } else if (prioStatus === 'medium') {
      tasks[i].current_prio = prioStatus;
    } else if (prioStatus === 'low') {
      tasks[i].current_prio = prioStatus;
    }
  }
  
  /**
   * This function enables the user to assign or unassign contacts to a task.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  async function editContacts(i) {
    const contactsWrapper = document.getElementById(
      `detail_task_contacts_wrapper${i}`
    );
    contactsWrapper.innerHTML = '';
    let user = await checkUser();
    if (user) {
      contactsWrapper.innerHTML = generateContactsDropdownHTML(i);
      renderEditContactList(i);
    } else {
      contactsWrapper.innerHTML = generateContactsDropdownHTML(i);
      renderEditContactList(i);
    }
  }
  
  /**
   * This function renders all contacts in a dropdown list.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function renderEditContactList(i) {
    const editContactsList = document.getElementById(`edit_contact_list${i}`);
    editContactsList.innerHTML = '';
    editContactsList.innerHTML += generateEditSelectAllHTML(i);
    let j;
    for (let j = 0; j < contacts.length; j++) {
      const oneContact = contacts[j];
      editContactsList.innerHTML += generateContactListEditHTML(i, j, oneContact);
      adaptInitialsToBackground(`initials_icon_${i}_${j}`);
    }
    addEditCheckboxEventListeners(i);
    updateCheckboxes(i, j);
  }
  
  /**
   * This function adds an event listener to the contacts' checkboxes. 
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function addEditCheckboxEventListeners(i) {
    const checkAllEditCheckbox = document.getElementById(
      `select_all_checkbox_${i}`
    );
    checkAllEditCheckbox.addEventListener('change', function () {
      selectAndUnselectAllEditContacts(i, checkAllEditCheckbox);
    });
  }
  
  /**
   * This function enables the user to select or unselect all contacts in one go.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @param {HTMLElement} checkAllEditCheckbox - This is the select-or-unselect-all
   * checkbox. 
   */
  function selectAndUnselectAllEditContacts(i, checkAllEditCheckbox) {
    for (let j = 0; j < contacts.length; j++) {
      const individualEditCheckbox = document.getElementById(
        `contact_checkbox_${i}_${j}`
      );
      if (checkAllEditCheckbox.checked && !individualEditCheckbox.checked) {
        individualEditCheckbox.checked = true;
        onCheckboxChange(i, j);
      } else if (
        !checkAllEditCheckbox.checked &&
        individualEditCheckbox.checked
      ) {
        individualEditCheckbox.checked = false;
        onCheckboxChange(i, j);
      }
    }
  }
  
 