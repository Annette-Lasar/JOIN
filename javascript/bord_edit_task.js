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
  
  /**
   * This function updates all checkboxes. It verifies whether a checkbox is checked
   * or unchecked. Then in calls further functions to add a contact to the current task
   * or remove it from it.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function updateCheckboxes(i) {
    const editContactsList = document.getElementById(`edit_contact_list${i}`);
    const selectAllCheckbox = document.getElementById(`select_all_checkbox_${i}`);
    const checkboxes = editContactsList.querySelectorAll(
      'input[type="checkbox"].individual-checkbox'
    );
    checkboxes.forEach((checkbox, j) => {
      const oneContact = contacts[j];
      const isChecked = isContactSelected(oneContact, i);
      checkbox.checked = isChecked;
    });
    selectAllCheckbox.checked = areAllContactsAdded(i);
  }
  
  function isContactSelected(contact, taskIndex) {
    const currentlyEditedContacts = tasks[taskIndex].current_contacts;
    return currentlyEditedContacts.some((selectedContactEdit) => {
      return (
        selectedContactEdit.name === contact.name &&
        selectedContactEdit.e_mail === contact.e_mail &&
        selectedContactEdit.phone === contact.phone &&
        selectedContactEdit.color === contact.color
      );
    });
  }
  
  /**
   * This function verifies whether an individual contact checkbox is checked or unchecked and
   * calls another function to remove the contact in question from the subarray or add it to it.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {number} j - This is the index of a contact in the subarray current_contacts.
   */
  function onCheckboxChange(i, j) {
    const checkbox = document.getElementById(`contact_checkbox_${i}_${j}`);
    const contact = contacts[j];
  
    if (checkbox.checked) {
      addContactToCurrentContacts(i, contact);
    } else {
      removeContactFromCurrentContacts(i, contact);
    }
  }
  
  /**
   * This function adds a contact to the subarray current_contacts of a task.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} contact - This is a JSON representing one contact in the subarray current_contacts.
   */
  function addContactToCurrentContacts(i, contact) {
    const currentContactsArray = tasks[i].current_contacts;
    if (!isContactInCurrentContacts(i, contact)) {
      currentContactsArray.push(contact);
    }
  }
  
  /**
   * This function removes a contact from the subarray current_contacts of a task.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} contact - This is a JSON representing one contact in the subarray current_contacts.
   */
  function removeContactFromCurrentContacts(i, contact) {
    const currentContactsArray = tasks[i].current_contacts;
    const indexToRemove = currentContactsArray.findIndex((existingContact) => {
      return (
        existingContact.name === contact.name &&
        existingContact.e_mail === contact.e_mail &&
        existingContact.phone === contact.phone &&
        existingContact.color === contact.color
      );
    });
    if (indexToRemove !== -1) {
      currentContactsArray.splice(indexToRemove, 1);
    }
  }
  
  /**
   * This function checks if a contact is already available in the subarray current_contacts.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} contact - This is a JSON representing one contact in the subarray current_contacts.
   * @returns 
   */
  function isContactInCurrentContacts(i, contact) {
    const currentContactsArray = tasks[i].current_contacts;
    return currentContactsArray.some(
      (existingContact) => existingContact === contact
    );
  }
  
  /**
   * This function checks if all available contacts from the array contacts 
   * have been added to the subarray current_contacts of a task.
   * @param {number} taskIndex - This is the index of a task in the array tasks.
   * @returns - The function returns true if a task's subarray current_contacts
   * contains all available contacts. 
   */
  function areAllContactsAdded(taskIndex) {
    const currentContacts = tasks[taskIndex].current_contacts;
    if (currentContacts.length !== contacts.length) {
      return false;
    }
    for (const contact of contacts) {
      if (
        !currentContacts.some((selectedContactEdit) =>
          isEqualContacts(selectedContactEdit, contact)
        )
      ) {
        return false;
      }
    }
  
    return true;
  }
  
  /**
   * This function checks if two contacts are equal to one another. 
   * @param {Object} contact1 - This is a JSON representing a contact in the task's subarray.
   * @param {Object} contact2 - This is a JSON representing a contact in the array contacts.
   * @returns 
   */
  function isEqualContacts(contact1, contact2) {
    return (
      contact1.name === contact2.name &&
      contact1.e_mail === contact2.e_mail &&
      contact1.phone === contact2.phone &&
      contact1.color === contact2.color
    );
  }
  
  /**
   * This function opens and closes the dropdown list contacts in the editing mode 
   * of a task.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {string} idContainer - This is the id of the unordered list that shall be toggled.
   * @param {string} idArrow - This is the id of the arrow next to the dropdown list that shall
   * be toggled.
   * @param {MouseEvent} event - This is a click event.
   */
  function toggleDropdownList(i, idContainer, idArrow, event) {
    event.stopPropagation();
    scrollToBottom(i);
    const DROPDOWN_LIST = document.getElementById(idContainer);
    const SELECT_ARROW = document.getElementById(idArrow);
    DROPDOWN_LIST.classList.toggle('show');
    SELECT_ARROW.classList.toggle('turn');
  }
  
  /**
   * This function replaces the subtask container by an input field and buttons
   * to make the subtasks editable.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} oneTask - This is a JSON representing a task in the array tasks.
   */
  function makeSubtasksEditable(i, oneTask) {
    const subtasksBox = document.getElementById(
      `detail_task_subtasks_wrapper${i}`
    );
    subtasksBox.innerHTML = '';
    subtasksBox.innerHTML = generateMakeSubtasksEditableHTML(i);
    renderSubtasksList(i, oneTask);
  }
  
  /**
   * This function renders a list of available subtasks.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} oneTask - This is a JSON representing a task in the array tasks.
   */
  function renderSubtasksList(i, oneTask) {
    const subtasksListContainer = document.getElementById(
      `subtask_container_${i}`
    );
    subtasksListContainer.innerHTML = '';
    for (let j = 0; j < oneTask.subtasks.length; j++) {
      const oneSubtask = oneTask.subtasks[j];
      subtasksListContainer.innerHTML += generateSubtasksListHTML(
        i,
        j,
        oneSubtask
      );
    }
  }
  
  /**
   * This function opens a container that displays two buttons, one to accept the 
   * creation of a new subtaks and one to abort it.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {string} action - This is the action 'show' or 'hide' to show or hide
   * the buttons.
   */
  function showAndHideCancelAndAcceptSubtask(i, action) {
    const closeAndCheckWrapper = document.getElementById(
      `close_and_check_wrapper_${i}`
    );
    const subtasksPlusButton = document.getElementById(`subtask_plus_${i}`);
    if (action === 'show') {
      closeAndCheckWrapper.classList.remove('d-none');
      subtasksPlusButton.classList.add('d-none');
    } else if (action === 'hide') {
      closeAndCheckWrapper.classList.add('d-none');
      subtasksPlusButton.classList.remove('d-none');
    }
  }
  
  /**
   * This function enables the user to clear the input field for a new subtask with
   * one click.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function clearSubtask(i) {
    const addSubtaskInputfield = document.getElementById(`input_subtasks${i}`);
    addSubtaskInputfield.value = '';
  }
  
  /**
   * This function adds a new subtask to the array subtasks and displays it. 
   * @param {number} i - This is the index of a taks in the array tasks.
   */
  function addNewSubtask(i) {
    const addSubtaskInputfield = document.getElementById(`input_subtasks${i}`);
    let newSubtask = {
      subtask_name: addSubtaskInputfield.value,
      checked_status: false,
    };
    tasks[i].subtasks.push(newSubtask);
    addSubtaskInputfield.value = '';
    renderSubtasksList(i, tasks[i]);
    showAndHideCancelAndAcceptSubtask(i, 'hide');
  }
  
  /**
   * This function displays buttons that enable the user to edit or delete a subtask.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {number} j - This is the index of a subtask in the subarray subtasks.
   */
  function editSubtask(i, j) {
    let oneSubtask = tasks[i].subtasks[j];
    const subtaskListItem = document.getElementById(
      `subtask_list_item_wrapper${i}_${j}`
    );
    subtaskListItem.innerHTML = '';
    subtaskListItem.innerHTML = generateEditSubtaskInputHTML(i, j, oneSubtask);
  }
  
  /**
   * This function enables the user to clear the input field to edit a subtask in
   * one go.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {number} j - This is the index of a subtask in the subarray subtasks.
   */
  function clearInputField(i, j) {
    const editSubtaskInputfield = document.getElementById(
      `edit_subtask_input_${i}_${j}`
    );
    editSubtaskInputfield.value = '';
  }
  
  /**
   * This function renders the edited subtask. It calls an alert message if the
   * input field is left empty.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {number} j - This is the index of a subtask in the subarray subtasks.
   */
  function updateEditedSubtask(i, j) {
    const editSubtaskInputfield = document.getElementById(
      `edit_subtask_input_${i}_${j}`
    );
    if (editSubtaskInputfield.value !== '') {
      let newCheckedSubtaskStatus = tasks[i].subtasks[j].checked_status;
      let editedSubtask = {
        subtask_name: editSubtaskInputfield.value,
        checked_status: newCheckedSubtaskStatus,
      };
      tasks[i].subtasks[j] = editedSubtask;
      renderSubtasksList(i, tasks[i]);
    } else {
      renderAlert(
        'alert_container',
        'alert_content',
        'Please enter a subtask text!'
      );
    }
  }
  
  /**
   * This function enables the user to delete a subtask.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @param {number} j - This is the index of a subtask in the array subtask.
   */
  function deleteSubtask(i, j) {
    const currentSubtask = tasks[i].subtasks[j];
    let currentSubtaskStatus = currentSubtask.checked_status;
    if (currentSubtaskStatus === true) {
      tasks[i].completed_subtasks--;
      tasks[i].subtasks.splice(j, 1);
    } else {
      tasks[i].subtasks.splice(j, 1);
    }
    renderSubtasksList(i, tasks[i]);
  }
  
  /**
   * This function scrolls the wrapping container to the bottom so that the
   * opened dropdown list is better visible.
   * @param {number} i - This is the index of a task in the array tasks.
   */
  function scrollToBottom(i) {
    const container = document.getElementById(`bottom_${i}`);
  
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }
  
  /**
   * This function creates an okay-button that saves all changes made to a task
   * in the editing mode.
   * @param {number} i - This is the index of a task in the array tasks. 
   */
  function createOkButton(i) {
    const okayButtonContainer = document.getElementById(`delete_and_edit_${i}`);
    okayButtonContainer.innerHTML = '';
    okayButtonContainer.innerHTML = generateOkayButtonHTML(i);
  }
  
  /**
   * This function executed by clicking on the x in the top right corner of a
   * task in the editing mode enables the user to abort his changes without saving them.
   * @param {number} i - This is the index of a task in the array tasks. 
   */
  function closeTaskWithoutSaving(i) {
    tasks[i] = currentlyEditedTask[0];
    currentlyEditedTask = [];
    renderTaskDetailView(i);
  }