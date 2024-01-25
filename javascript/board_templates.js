/**
 * This function  generates an overflow indicator for those contacts that
 * are not visibile due to limited space on the outside of a card
 * @param {number} hiddenContactsCount - This is the number of contacts that aren't visible
 * on the outside of a card. It's calculated according to the available space and
 * the width of a contact icon. 
 * @returns - The HTML code is returned to the calling function.
 */
function generateOverflowIndicatorOutsideCardHTML(hiddenContactsCount) {
    return /* html */ `
        <div id="overflow_indicator" class="overflow-indicator">
          +${hiddenContactsCount}
        </div>
      `;
  }

  /**
   * This function generates the HTML code on the outside of a task card.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {number} j - This is the index of a contact in the subarray current_contacts.
   * @param {Object} oneContact - This is a JSON that holds all information of a contact.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateTaskContactHTML(i, j, oneContact) {
    const [firstName, lastName] = oneContact.name.split(' ');
    return /* html */ `
          <div id="initials_icons_outside_card_${i}_${j}" class="initials-icon" style="background-color: ${
      oneContact.color
    }">${firstName[0]}${lastName ? lastName[0] : ''}</div>
      `;
  }

  /**
   * This function generates the HTML code that shows contacts in the detailed
   * view of a task card.
   * @param {*} i - This is the index of a task in the array tasks.
   * @param {*} j - This is the index of a contact in the subarray current_contacts.
   * @param {*} oneContact - This is a JSON that holds all information of a contact.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateDetailTaskContactNamesHTML(i, j, oneContact) {
    const [firstName, lastName] = oneContact.name.split(' ');
    return /* html */ `
        <div class="initials-and-name-wrapper">
          <div id="detail_view_initials_icon_${i}_${j}" class="initials-icon" style="background-color: ${
      oneContact.color
    }">${firstName[0]}${lastName ? lastName[0] : ''}</div>
          <div>${oneContact.name}</div>
          
        </div>
      `;
  }

  /**
   * This function generates the HTML code for the current due date.
   * @param {Date} currentDueDate - This is the current due date formatted 
   * in the pattern of dd/mm/yyyy. 
   * @returns - The HTML code is returned to the calling function.
   */
  function generateDueDateForDetailViewHTML(currentDueDate) {
    return /* html */ `
        <span class="due-date">Due date: </span>
        <span>${currentDueDate}</span>
    `;
  }

/**
 * This function generates HTML code that displays all subtasks in the detailed view of a task
 * the user gets by clicking on a task card.
 * @param {number} i - This is the index of a task in the array tasks.
 * @param {number} j - This is the index of a contact in the subarray current_contacts.
 * @param {Object} oneSubtask - This is one JSON of the subarray subtasks.
 * @returns - The HTML code is returned to the calling function.
 */
  function generateSubtasksDetailViewHTML(i, j, oneSubtask) {
    return /* html */ `
        <div onclick="(function() {
          const oneTask = tasks[${i}];
          const indiviualSubtaskCheckbox = document.getElementById(
            'individual_subtask_checkbox_${i}_${j}'
          );
          if (!indiviualSubtaskCheckbox.hasEventListener) {
            indiviualSubtaskCheckbox.addEventListener('change', function () {
              checkForCompletedSubtasks(${j}, oneTask, indiviualSubtaskCheckbox);
            });
            indiviualSubtaskCheckbox.hasEventListener = true;
          }
        })()" class="inner-subtask-wrapper">
            <input id="individual_subtask_checkbox_${i}_${j}" type="checkbox">
            <label for="individual_subtask_checkbox_${i}_${j}" class="subtask-name">${oneSubtask.subtask_name}</label>
        </div>
    `;
  }

  /**
   * This function generates HTML code that shows task cards on the kanban board.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} oneTask - This is one task in the array tasks.
   * @param {string} newTruncatedSentence - This represents the first six words of a task description.
   * @param {number} completedSubtasksInPercent - This is the number of completed subtaks in relation to the 
   * total number of subtasks on a task card.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateToDoHTML(
    i,
    oneTask,
    newTruncatedSentence,
    completedSubtasksInPercent
  ) {
    return /* html */ `
            <div id="taskCard_${i}" data-status="${oneTask.status}" draggable="true" onclick="openOrCloseContainer(${i}, 'detail_task_wrapper_${i}', 'open')" ondragstart="startDragging(${i})" class="todo">
              <div class="todo-header-wrapper">
                  <div class="todo-category" style="background-color: ${oneTask.current_category[0].category_color}; border: 1px solid ${oneTask.current_category[0].category_color};">${oneTask.current_category[0].category_name}</div>
                  <div onclick="openCardContextMenu(${i}, '${oneTask.status}', event)" class="three-dots-wrapper"><img src="../icons/three_dots.svg"></div>
              </div>
              <div class="todo-title">${oneTask['title']}</div>
                  <div class="todo-description">${newTruncatedSentence}</div>
                  <div id="progress_wrapper_${i}" class="progress-wrapper">
                  <progress id="progress_bar_${i}" class="progress-bar" value="${completedSubtasksInPercent}" max="100"> 32 %</progress>  
                    <label id="label_for_progress_bar_${i}" class="label-for-progress" for="progress_bar">${oneTask.completed_subtasks}/${oneTask.subtasks.length} Subtasks</label>
                  </div>
                  <div class="contacts-and-prio-wrapper">
                    <div id="task_contact_${i}" class="task-contact-wrapper"></div>
                    <div class="task-prio">
                        <img class="prio-icon" src="../icons/prio_${oneTask.current_prio}.svg">
                    </div>
              </div>
                <div id="context_menu_${i}" class="context-menu-card d-none" data-index="${i}">  
                    <div onclick="closeCardContextMenu(${i}, event)" class="context-menu-title-wrapper">
                      <div class="context-menu-move-to-wrapper">
                        <h3>Move card to ...</h3>  
                        <img id="context_menu_close_${i}"  class="context-menu-close" src="../icons/close_white.svg">
                      </div>
                    </div>  
                    <ul>
                      <li onclick="moveToNewList(${i}, 'toDo', event)" id="toDo_${i}">To do</li>
                      <li onclick="moveToNewList(${i}, 'inProgress', event)" id="inProgress_${i}">In progress</li>
                      <li onclick="moveToNewList(${i}, 'awaitFeedback', event)" id="awaitFeedback_${i}">Await feedback</li>
                      <li onclick="moveToNewList(${i}, 'done', event)" id="done_${i}">Done</li>
                    </ul>
                </div>  
            </div>
            <div onclick="clickOutsideDropdown(${i}, event)" id="detail_task_wrapper_${i}" class="detail-task-wrapper d-none"></div>
            `;
  }


  /**
   * This function generates HTML code that displays a detailed view of a task
   * the user gets by clicking on a task card.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} oneTask - This is a JSON that represents one task in the array tasks.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateDetailViewHTML(i, oneTask) {
    return /* html */ `
          <div id="category_and_close_wrapper${i}" class="category-and-close-wrapper">
            <div class="todo-category" style="background-color: ${oneTask.current_category[0].category_color}; border: 1px solid ${oneTask.current_category[0].category_color};">${oneTask.current_category[0].category_name}</div>
            <img class="detail-close-button" onclick="openOrCloseContainer(${i}, 'detail_task_wrapper_${i}', 'close')" src="../icons/close.svg" alt="">
          </div>
          <div id="edit_task_wrapper${i}">
          <div id="detail_title${i}">
              <h4>${oneTask.title}</h4>
          </div>
          <div id="detail_description${i}">
            <div class="task-description">${oneTask.description}</div>
          </div>
          <div id="current_due_date_${i}" class="task-due-date-wrapper">
            <span class="due-date">Due date: </span>
            <span>${oneTask.current_due_date}</span>
          </div>
          <div id="task_priority_wrapper${i}" class="task-priority-wrapper">
            <div class="priority">Priority:</div>
            <div class="prio-wrapper">
              <div>${oneTask.current_prio}</div>
                <img class="prio-icon" src="../icons/prio_${oneTask.current_prio}.svg" alt="">
            </div>
          </div>
          <div id="detail_task_contacts_wrapper${i}" class="detail-task-contacts-wrapper">
            <div class="assigned-to">Assigned To:</div>
            <div>
              <div class="detail-contacts-wrapper">
                <div id="detail_contacts_name_${i}" class="contact-name"></div>
              </div>
            </div>
          </div>
            <div id="detail_task_subtasks_wrapper${i}" class="detail-task-subtasks-wrapper">
              <div class="subtasks-title">Subtasks:</div>
              <div id="detail_subtasks_wrapper_${i}" class="detail-subtasks-wrapper"></div>
            </div>
            <div id="bottom_${i}"></div>
          </div>
          <div id="delete_and_edit_wrapper${i}" class="delete-and-edit-wrapper">
            <div id="delete_and_edit_${i}" class="delete-and-edit">
              <div onclick="renderConfirmDelete(${i}, 'confirm_container', 'confirm_content', 'Are you sure you want to delete this task permanently? This process is irreversible.');" class="delete-wrapper">
                <img src="../icons/delete.svg" alt="">
                <div>Delete</div>
              </div>
              <div onclick="editTask(${i})" class="edit-wrapper">
                <img src="../icons/edit_dark.svg" alt="">
                <div>Edit</div>
              </div>
            </div>
          </div>
    `;
  }

  /**
   * This function generates the HTML code for a button displaying an X in the top right 
   * corner of a card's detailed view.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @returns - The HTML code is returned to the calling function.
   */
  function generateCloseIcon(i) {
    return /* html */ `
      <div id="edit_close_button_wrapper${i}" class="edit-close-button-wrapper">
        <img class="detail-close-button" onclick="closeTaskWithoutSaving(${i})" src="../icons/close.svg" alt="">
      </div>
    `;
  }

  /**
   * This function generates an input box that enables the user to edit a task's title.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @param {Object} oneTask - This is a JSON that represents one task in the array tasks.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateEditTitleHTML(i, oneTask) {
    return /* html */ `
        <div class="edited-task-title-wrapper">
            <div class="edit-headline">Title</div>
            <input onblur="updateEditedTitle(${i})" id="edited_task_title_${i}" type="text" value="${oneTask.title}" class="edited-task-title">
            <div id="title_instruction_text_${i}" class="instruction-text">Please enter a title.</div>
        </div>
    `;
  }

  /**
   * This function generates a textarea field that enables the user to edit a task's description.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @param {Object} oneTask - This is a JSON that represents one task in the array tasks.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateEditDescriptionHTML(i, oneTask) {
    return /* html */ `
    <div>
      <div class="edit-headline">Description</div>
      <textarea onblur="updateEditedDescription(${i})" name="description" id="edited_task_description${i}" class="edited-task-description" cols="30" rows="5" placeholder="Enter your description">${oneTask.description}</textarea>
    </div>
    `;
  }

  /**
   * This function generates an input field that enables the user to edit a task's due date.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {Object} oneTask - This is a JSON that represents one task in the array tasks.
   * @param {Date} minimumDueDate - This is today's date that acts as the minimum date for 
   * the input field of the type 'date' so that the user cannot enter a due date in the past.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateEditDueDateHTML(i, oneTask, minimumDueDate) {
    return /* html */ `
        <div class="edited-due-date-wrapper">
          <div class="edit-headline">Due date</div>
          <input onblur="updateEditedDueDate(${i})" id="edited_task_due_date${i}" type="date" min="${minimumDueDate}" class="edited-due-date" value="${oneTask.current_due_date}">
          <div id="due_date_instruction_text${i}" class="instruction-text">Please enter a due date.</div>
        </div>
    `;
  }

  /**
   * This function generates the HTML code for the three priority buttons. The user has the
   * possibility to change a task's priority. The icons are represented by svg elements so that
   * their colors can be changed by clicking on them.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @returns - The HTML code is returned to the calling function.
   */
  function generatePriorityButtonsHTML(i) {
    return /* html */ `
      <section id="edit_prio_section${i}" class="edit-prio-section">
                <div class="edit-headline">Priority</div>
                <div id="prio_button_wrapper_${i}" class="prio-button-wrapper">
                  <button
                    id="prio_button_urgent_${i}"
                    onclick="changePrioStatusEdit(${i}, 'urgent')"
                    class="prio-button"
                  >
                    Urgent
                    <svg
                      class="svg-urgent"
                      width="18"
                      height="12"
                      viewBox="0 0 21 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5712 14.7547C19.3366 14.7551 19.1081 14.6803 18.9192 14.5412L10.6671 8.458L2.41508 14.5412C2.29923 14.6267 2.16765 14.6887 2.02785 14.7234C1.88805 14.7582 1.74277 14.7651 1.6003 14.7437C1.45783 14.7223 1.32097 14.6732 1.19752 14.599C1.07408 14.5247 0.966466 14.427 0.880837 14.3112C0.795208 14.1954 0.733236 14.0639 0.698459 13.9243C0.663683 13.7846 0.656782 13.6394 0.678153 13.497C0.721312 13.2095 0.877002 12.9509 1.11097 12.7781L10.0151 6.20761C10.2038 6.06802 10.4324 5.99268 10.6671 5.99268C10.9019 5.99268 11.1305 6.06802 11.3192 6.20761L20.2233 12.7781C20.4092 12.915 20.5471 13.1071 20.6173 13.327C20.6874 13.5469 20.6862 13.7833 20.6139 14.0025C20.5416 14.2216 20.4019 14.4124 20.2146 14.5475C20.0274 14.6826 19.8022 14.7551 19.5712 14.7547Z"
                        fill="#FF3D00"
                      />
                      <path
                        d="M19.5713 9.00568C19.3366 9.00609 19.1081 8.93124 18.9192 8.79214L10.6671 2.70898L2.41509 8.79214C2.18112 8.96495 1.88803 9.0378 1.6003 8.99468C1.31257 8.95155 1.05378 8.79597 0.880842 8.56218C0.707906 8.32838 0.634998 8.03551 0.678157 7.74799C0.721316 7.46048 0.877007 7.20187 1.11098 7.02906L10.0151 0.458588C10.2038 0.318997 10.4324 0.243652 10.6671 0.243652C10.9019 0.243652 11.1305 0.318997 11.3192 0.458588L20.2233 7.02906C20.4092 7.16598 20.5471 7.35809 20.6173 7.57797C20.6874 7.79785 20.6863 8.03426 20.6139 8.25344C20.5416 8.47262 20.4019 8.66338 20.2146 8.79847C20.0274 8.93356 19.8022 9.00608 19.5713 9.00568Z"
                        fill="#FF3D00"
                      />
                    </svg>
                  </button>
                  <button
                    id="prio_button_medium_${i}"
                    onclick="changePrioStatusEdit(${i}, 'medium')"
                    class="prio-button prio-marked-medium"
                  >
                    Medium
                    <svg
                      class="svg-medium"
                      width="20"
                      height="9"
                      viewBox="0 0 20 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.9041 8.22528H1.09589C0.805242 8.22528 0.526498 8.10898 0.320979 7.90197C0.11546 7.69495 0 7.41419 0 7.12143C0 6.82867 0.11546 6.5479 0.320979 6.34089C0.526498 6.13388 0.805242 6.01758 1.09589 6.01758H18.9041C19.1948 6.01758 19.4735 6.13388 19.679 6.34089C19.8845 6.5479 20 6.82867 20 7.12143C20 7.41419 19.8845 7.69495 19.679 7.90197C19.4735 8.10898 19.1948 8.22528 18.9041 8.22528Z"
                        fill="#FFA35e"
                      />
                      <path
                        d="M18.9041 2.98211H1.09589C0.805242 2.98211 0.526498 2.86581 0.320979 2.6588C0.11546 2.45179 0 2.17102 0 1.87826C0 1.5855 0.11546 1.30474 0.320979 1.09772C0.526498 0.890712 0.805242 0.774414 1.09589 0.774414L18.9041 0.774414C19.1948 0.774414 19.4735 0.890712 19.679 1.09772C19.8845 1.30474 20 1.5855 20 1.87826C20 2.17102 19.8845 2.45179 19.679 2.6588C19.4735 2.86581 19.1948 2.98211 18.9041 2.98211Z"
                        fill="#FFA35e"
                      />
                    </svg>
                  </button>
                  <button
                    id="prio_button_low_${i}"
                    onclick="changePrioStatusEdit(${i}, 'low')"
                    class="prio-button"
                  >
                    Low
                    <svg
                      class="svg-low"
                      width="18"
                      height="12"
                      viewBox="0 0 21 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.334 9.00589C10.0994 9.0063 9.87085 8.93145 9.682 8.79238L0.778897 2.22264C0.663059 2.13708 0.565219 2.02957 0.490964 1.90623C0.416709 1.78289 0.367492 1.64614 0.346125 1.50379C0.30297 1.21631 0.37587 0.923473 0.548786 0.689701C0.721702 0.455928 0.980471 0.300371 1.26817 0.257248C1.55586 0.214126 1.84891 0.286972 2.08286 0.45976L10.334 6.54224L18.5851 0.45976C18.7009 0.374204 18.8325 0.312285 18.9723 0.277538C19.1121 0.242791 19.2574 0.235896 19.3998 0.257248C19.5423 0.2786 19.6791 0.32778 19.8025 0.401981C19.926 0.476181 20.0336 0.573948 20.1192 0.689701C20.2048 0.805453 20.2668 0.936923 20.3015 1.07661C20.3363 1.21629 20.3432 1.36145 20.3218 1.50379C20.3005 1.64614 20.2513 1.78289 20.177 1.90623C20.1027 2.02957 20.0049 2.13708 19.8891 2.22264L10.986 8.79238C10.7971 8.93145 10.5686 9.0063 10.334 9.00589Z"
                        fill="#7AE229"
                      />
                      <path
                        d="M10.334 14.7544C10.0994 14.7548 9.87085 14.68 9.682 14.5409L0.778897 7.97117C0.544952 7.79839 0.389279 7.53981 0.346125 7.25233C0.30297 6.96485 0.37587 6.67201 0.548786 6.43824C0.721702 6.20446 0.980471 6.04891 1.26817 6.00578C1.55586 5.96266 1.84891 6.03551 2.08286 6.2083L10.334 12.2908L18.5851 6.2083C18.8191 6.03551 19.1121 5.96266 19.3998 6.00578C19.6875 6.04891 19.9463 6.20446 20.1192 6.43824C20.2921 6.67201 20.365 6.96485 20.3218 7.25233C20.2787 7.53981 20.123 7.79839 19.8891 7.97117L10.986 14.5409C10.7971 14.68 10.5686 14.7548 10.334 14.7544Z"
                        fill="#7AE229"
                      />
                    </svg>
                  </button>
                </div>
              </section>
    `;
  }

  /**
   * This function generates a dropdown list displaying all contacts. This list enables the
   * user to select or unselect contacts that shall be assigned to a task. The list items
   * themselves are generated by another function.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @returns - The HTML code is returned to the calling function.
   */
  function generateContactsDropdownHTML(i) {
    return /* html */ `
            <section class="edit-contact-wrapper">
              <div class="edit-headline">Assigned to</div>
              <div
                onclick="toggleDropdownList(${i}, 'edit_contact_list${i}', 'select_arrow_contacts${i}', event)"
                class="edit-contacts-dropdown-list"
              >
                Select contacts to assign<img
                  id="select_arrow_contacts${i}"
                  class="edit-select-arrow-contacts"
                  src="../icons/arrow_drop_down.svg"
                />
              </div>
              <ul id="edit_contact_list${i}" class="edit-contact-list">
              </ul>
            </section>
    `;
  } 

  /**
   * This function generates a list item in the edit-contacts-list that enables the user
   * to select or unselect all contacts in one go. 
   * @param {number} i - This is the index of one task in the array tasks. 
   * @returns - The HTML code is returned to the calling function.
   */
  function generateEditSelectAllHTML(i) {
    return /* html */ `
      <li class="contact-list-element">
        <label for="select_all_checkbox_${i}" class="initials-wrapper">
          <div class="contact-name-wrapper">
            <div>
              Select or unselect all contacts
            </div>
          </div>
        </label>
        <div><input id="select_all_checkbox_${i}" type="checkbox"></div>
      </li>
    `;
  }

  /**
   * This function generates a the list elements of a dropdown list displaying 
   * all contacts. This list enables the user to select or unselect
   * contacts that shall be assigned to a task.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {number} j - This is the index of a contact in the subarray current_contacts.
   * @param {Object} oneContact - This is a JSON representing one contact in the subarray
   * current_contacts.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateContactListEditHTML(i, j, oneContact) {
    const [firstName, lastName] = oneContact.name.split(' ');
    return /* html */ `
        <li class="contact-list-element">
          <label for="contact_checkbox_${i}_${j}" class="initials-wrapper">
            <div class="contact-name-wrapper">
              <div id="initials_icon_${i}_${j}" class="initials-icon" style="background-color: ${
      oneContact.color
    }">${firstName[0]}${lastName ? lastName[0] : ''}</div>
              <div>
            ${oneContact.name}
              </div>
            </div>
          </label>
          <div><input onchange="onCheckboxChange(${i}, ${j})" id="contact_checkbox_${i}_${j}" class="individual-checkbox" type="checkbox"></div>
        </li>
      `;
  }

  /**
   * This function generates the HTML code for an input field and buttons so that
   * the user can add new subtasks. 
   * @param {number} i - This is the index of a task in the array tasks.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateMakeSubtasksEditableHTML(i) {
    return /* html */ `
      <section id="section_subtasks_${i}">
        <div class="edit-headline">Subtasks</div>
        <div id="edit_subtask_wrapper${i}" class="edit-subtask-wrapper">
          <input
            id="input_subtasks${i}"
            class="input-subtasks"
            type="text"
            placeholder="Add new subtask"
         />
          <div
            id="subtasks_image_wrapper_${i}"
            class="subtasks-image-wrapper"
            >
            <div
              id="close_and_check_wrapper_${i}"
              class="close-and-check-wrapper d-none"
              >
                <img
                  onclick="clearSubtask(${i})"
                  id="clear_subtask_${i}"
                  class="clear-subtask"
                  src="../icons/close.svg"
                  />
                <div class="subtask-icon-separator"></div>
                <img
                  onclick="addNewSubtask(${i})"
                  id="check_subtask_${i}"
                  class="check-subtask"
                  src="../icons/check.svg"
                />
            </div>
            <img
              id="subtask_plus_${i}"
              class="edit-plus-button"
              onclick="showAndHideCancelAndAcceptSubtask(${i}, 'show')"
              src="../icons/plus.svg"
              />
          </div>
        </div>
      </section>
      <section
        id="subtask_container_${i}"
        class="subtask-container"
      ></section>
    `;
  }

  /**
   * This function generates the HTML code that displays the available subtaks. They 
   * have buttons next to them so that they can be edited or deleted by the user. 
   * @param {number} i - This is the index of one task in the array tasks.
   * @param {number} j - This is the index of one subtask in the subarray subtasks.
   * @param {Object} oneSubtask - This is a JSON representing one subtask in the 
   * subarray subtasks.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateSubtasksListHTML(i, j, oneSubtask) {
    return /* html */ `
      <div id="subtask_list_item_wrapper${i}_${j}" class="subtask-list-item-wrapper">
          <div id="subtask_list_item${i}_${j}" class="subtask-list-item">${oneSubtask.subtask_name}</div>
          <div class="subtask-list-item-icon-wrapper">
            <img onclick="editSubtask(${i}, ${j})" src="../icons/edit_dark.svg">
            <div class="subtask-icon-separator"></div>
            <img onclick="deleteSubtask(${i}, ${j})" src="../icons/delete.svg">
          </div>
      </div>
          
    `;
  }

  /**
   * This function generates an input field that enables the user to edit a subtask.
   * @param {number} i - This is the index of a task in the array tasks.
   * @param {number} j - This is the index of a subtask in the subarray subtasks.
   * @param {Object} oneSubtask - This is a JSON representing one subtask in the 
   * subarray subtasks. 
   * @returns - The HTML code is returned to the calling function.
   */
  function generateEditSubtaskInputHTML(i, j, oneSubtask) {
    return /* html */ `
      <div class="edit-subtask-inputfield-wrapper">
        <input id="edit_subtask_input_${i}_${j}" type="text" value="${oneSubtask.subtask_name}">
        <div class="edit-subtask-icons-wrapper">
          <img onclick="clearInputField(${i}, ${j})" src="../icons/close.svg">
          <div class="subtask-icon-separator"></div>
          <img onclick="updateEditedSubtask(${i}, ${j})" src="../icons/check.svg">
        </div>
      </div>
    `;
  }

  /**
   * This function generates a button that saves all the changes made to a task.
   * @param {number} i - This is the index of a task in the array tasks. 
   * @returns - The HTML code is returned to the calling function.
   */
  function generateOkayButtonHTML(i) {
    return /* html */ `
    <div class="okay-wrapper">
      <button onclick="renderTaskDetailView(${i})" class="edit-okay-button">
        OK
        <img src="../icons/check.svg" height=10">
      </button>
    </div>
    `;
  }

  /**
   * This function generates an overlay container that enables the user to create
   * a new task on the board. The new task is shown in the list that the user clicked
   * to open this overlay container.
   * @param {string} status - This is the status of the list the task is going to be displayed in.
   * @returns - The HTML code is returned to the calling function.
   */
  function generateCreateTaskButtonsHTML(status) {
    return /* html */ `
  <div class="explanation-container">
            <span class="red">*</span>This field is required
          </div>
          <div class="task-and-clear-button-wrapper">
            <button onclick="clearAllTaskContainers()" class="clear-button">
              Clear
              <svg
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_71720_5473"
                  style="mask-type: alpha"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="25"
                >
                  <rect y="0.96582" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_71720_5473)">
                  <path
                    class="x-icon"
                    d="M11.9998 14.3659L7.0998 19.2659C6.91647 19.4492 6.68314 19.5409 6.3998 19.5409C6.11647 19.5409 5.88314 19.4492 5.6998 19.2659C5.51647 19.0825 5.4248 18.8492 5.4248 18.5659C5.4248 18.2825 5.51647 18.0492 5.6998 17.8659L10.5998 12.9659L5.6998 8.06587C5.51647 7.88254 5.4248 7.6492 5.4248 7.36587C5.4248 7.08254 5.51647 6.8492 5.6998 6.66587C5.88314 6.48254 6.11647 6.39087 6.3998 6.39087C6.68314 6.39087 6.91647 6.48254 7.0998 6.66587L11.9998 11.5659L16.8998 6.66587C17.0831 6.48254 17.3165 6.39087 17.5998 6.39087C17.8831 6.39087 18.1165 6.48254 18.2998 6.66587C18.4831 6.8492 18.5748 7.08254 18.5748 7.36587C18.5748 7.6492 18.4831 7.88254 18.2998 8.06587L13.3998 12.9659L18.2998 17.8659C18.4831 18.0492 18.5748 18.2825 18.5748 18.5659C18.5748 18.8492 18.4831 19.0825 18.2998 19.2659C18.1165 19.4492 17.8831 19.5409 17.5998 19.5409C17.3165 19.5409 17.0831 19.4492 16.8998 19.2659L11.9998 14.3659Z"
                    fill="#2A3647"
                  />
                </g>
              </svg>
            </button>
            <button onclick="createNewTask('${status}', event)" class="dark-button">
              Create task
              <img src="../icons/check.svg" alt="" />
            </button>
          </div>
    `;
  }