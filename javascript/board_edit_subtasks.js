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