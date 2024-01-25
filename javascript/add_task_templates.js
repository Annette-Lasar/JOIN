

function generateContactListHTML(i, oneContact) {
  const [firstName, lastName] = oneContact.name.split(' ');
  return /* html */ `
      <li class="contact-list-element">
        <label for="contact_checkbox_${i}" class="initials-wrapper">
          <div class="contact-initials-and-text-wrapper">
              <div id="initials_icon_in_list_${i}" class="initials-icon" style="background-color: ${
                oneContact.color
                }">${firstName[0]}${lastName ? lastName[0] : ''}</div>
              <div>${oneContact.name}</div>
          </div>
          <div><input id="contact_checkbox_${i}" type="checkbox"></div>
        </label>
      </li>
    `;
}

function generateSelectAllHTML() {
  return /* html */ `
      <li class="contact-list-element">
        <label for="select_all_checkbox" class="initials-wrapper">
            <div>Select or unselect all contacts</div>
            <input id="select_all_checkbox" type="checkbox">
        </label>
      </li>
    `;
}

function generateContactsIconsHTML(i, oneContact) {
  const [firstName, lastName] = oneContact.name.split(' ');
  return /* html */ `
      <span id="initials_icon_assigned_${i}" class="initials-icon" style="background-color: ${
        oneContact.color
      }">${firstName[0]}${lastName ? lastName[0] : ''}</span>
    `;
}

function generateOverflowIndicatorHTML(hiddenContactsCount) {
  return /* html */ `
      <div id="overflow_indicator" class="overflow-indicator">
        +${hiddenContactsCount}
      </div>
    `;
}

function generateNewCategoryBoxHTML(i, containerType) {
  return /* html */ `
      <div id="new_category_${containerType}" class="new-category">
        <div>New category</div>
        <div id="new_category_plus_${containerType}" onclick="createNewCategory(${i}, '${containerType}')" class="new-category-plus"><img src="../icons/plus.svg" alt=""></div>
      </div>
    `;
}

function generateCategoryListHTML(i, currentCategory, containerType) {
  return /* html */ `
          <li id="category_item_${containerType}_${i}" class="category-item">
            <div id="icon_and_category_wrapper_${containerType}_${i}" onclick="selectTaskCategory('${currentCategory.category_name}', '${currentCategory.category_color}')" class="icon-and-category-wrapper">
              <svg id="category_circle_icon_${containerType}_${i}" width="16" height="16">
              <circle cx="8" cy="8" r="6" fill="${currentCategory.category_color}" stroke="black" stroke-width="1"/>
              </svg>
              <div>
              ${currentCategory.category_name}
              </div>
            </div>
            <div class="category-icon-wrapper">
              <img onclick="editCategory(${i}, '${currentCategory.category_name}', '${currentCategory.category_color}', '${containerType}')" src="../icons/edit_dark.svg" height="14">
              <div class="subtask-separator-line"></div>
              <img onclick="deleteCategory(${i})" src="../icons/delete.svg" height="14">
            </div>
          </li>
      `;
}

function generateCurrentCategoryHTML(
  currentCategoryName,
  currentCategoryColor
) {
  return /* html */ `
       <div  class="task-category-text">
            <svg  width="16" height="16">
             <circle cx="8" cy="8" r="6" fill="${currentCategoryColor}" stroke="black" stroke-width="1"/>
            </svg>
              <div>
              ${currentCategoryName}
              </div>
       </div>
      `;
}

function generateCategoryInputHTML(
  i,
  currentCategoryName,
  currentCategoryColor,
  containerType
) {
  return /* html */ `
      <div class="icon-and-category-wrapper">
        <input id="color_input_${containerType}_${i}" class="color-input-category" type="color" value="${currentCategoryColor}">
        <input id="category_input_${containerType}_${i}" type="text" class="input-edit-category-text" value="${currentCategoryName}" required>
        <div class="close-and-check-wrapper-edit-subtask">
          <img onclick="renderCategories()" class="cancel-edit-subtask" src="../icons/close.svg" alt="">
          <div class="subtask-separator-line"></div>
          <img onclick="changeCategoryTextAndColor(${i}, '${containerType}')" class="check-edit-subtask" src="../icons/check.svg" alt="">
        </div>
      </div>
      
    `;
}

function generateInputForNewCategoryHTML(i, containerType, randomColor) {
  return /* html */ `
      <input id="color_new_input_${containerType}_${i}" type="color" value="${randomColor}">
      <input id="category_new_input_${containerType}" type="text" class="category-new-input" placeholder="Pick color and add category">
      <div class="close-and-check-wrapper-edit-subtask">
          <img onclick="renderCategories()" class="cancel-edit-subtask" src="../icons/close.svg" alt="">
          <div class="subtask-separator-line"></div>
          <img onclick="addNewCategory(${i}, '${containerType}')" class="check-edit-subtask" src="../icons/check.svg" alt="">
        </div>
    `;
}

/**
 * With this function the html code for rendering the subtask is generated.
 * @param {integer} i - Index of the current task.
 * @param {string} subtask - Value/ text of the current task
 * @param {string} containerType - Container type ('small' or 'big') according to
 * whether the user is working in a small or wide viewport
 * @returns
 */
function generateSubtaskHTML(i, subtask, containerType) {
  return /* html */ `
      <div id="subtask_list_wrapper_${containerType}_${i}" class="subtask-list-${containerType}">${subtask.subtask_name}
        <div class="subtask-button-wrapper-${containerType}">
          <img onclick="editSubtask(${i}, '${containerType}', '${subtask.subtask_name}')" src="../icons/edit_dark.svg">
          <div class="subtask-separator-line"></div>
          <img onclick="deleteSubtask(${i})" src="../icons/delete.svg">
        </div>
      </div>
  `;
}

/**
 * This function generates an input field that contains the text of the former
 * subtask and two buttons (x and accept) which are separated by a vertical line.
 * @param {integer} i - index of the current subtask
 * @param {string} containerType - 'small' or 'big' according to the viewport size
 * @param {string} subtask - text of the current subtask
 * @returns
 */
function generateInputEditHTML(i, containerType, subtask) {
  return /* html */ `
      <div class="edit-subtask-wrapper">
        <input type="text" id="edit_input_${containerType}_${i}" value="${subtask}" class="edit-input" placeholder="Enter your edited subtask text">
        <div class="close-and-check-wrapper-edit-subtask">
          <img onclick="renderSubtasks()" class="cancel-edit-subtask" src="../icons/close.svg" alt="">
          <div class="subtask-separator-line"></div>
          <img onclick="changeSubtaskText(${i}, '${containerType}', '${subtask}')" class="check-edit-subtask" src="../icons/check.svg" alt="">
        </div>
      </div>
    `;
}
