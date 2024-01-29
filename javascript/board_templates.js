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
                  <div id="todo_category_${i}" class="todo-category" style="background-color: ${oneTask.current_category[0].category_color}; border: 1px solid ${oneTask.current_category[0].category_color};">${oneTask.current_category[0].category_name}</div>
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
