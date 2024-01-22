async function init() {
  moveLogoOnStartScreen();
  await includeHTML();
  hideHelpLinkOnHelpPage();
  hideNavIconsOnExternalSites();
  activeSite();
  checkIfStartScreen();
  checkIfSummaryPage();
  checkIfBoardPage();
  showInitials();
}

async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html'); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}

/* -------------------------- start screen ---------------------------------- */
function moveLogoOnStartScreen() {
  const URL = window.location.href;
  if (URL.endsWith('index.html')) {
    setTimeout(() => {
      document
        .getElementById('login_page')
        .classList.add('change-background-color');
      document.getElementById('login_join_logo').classList.add('animate-logo');
      document.getElementById('path_dot').classList.add('change-logo-color');
      document.getElementById('path_j').classList.add('change-logo-color');
      document.getElementById('path_o').classList.add('change-logo-color');
      document.getElementById('path_i').classList.add('change-logo-color');
      document.getElementById('path_n').classList.add('change-logo-color');
    }, 500);
  }
}

function hideNavIconsOnExternalSites() {
  let menuWrapper = document.getElementById('menu_items_wrapper');
  let legalNoticeLink = document.getElementById('legal_notice_link');
  let privacyPolicyLink = document.getElementById('privacy_policy_link');
  let headerIcons = document.getElementById('header_icons');
  const URL = window.location.href;
  if (URL.endsWith('external.html')) {
    menuWrapper.style.display = 'none';
    headerIcons.style.display = 'none';
    legalNoticeLink.href = './legal_notice_external.html';
    privacyPolicyLink.href = './privacy_policy_external.html';
  }
}

function activeSite() {
  const URL = window.location.href;
  let focusedId =
    URL.slice(URL.lastIndexOf('/') + 1, URL.lastIndexOf('.')) + '_link';
  if (
    focusedId == 'privacy_policy_external_link' ||
    focusedId == 'legal_notice_external_link'
  ) {
    focusedId = focusedId.replace('_external', '');
  } else if (focusedId == 'index_link') {
    return;
  }
  document.getElementById(focusedId).classList.add('active');
}

function toggleHeaderMenu() {
  document.getElementById('header_menu').classList.toggle('d-none');
  document.getElementById('background_wrapper').classList.toggle('d-none');
  document.getElementById('user_icon').classList.toggle('header-active');
}

function hideHelpLinkOnHelpPage() {
  let headerHelpIcon = document.getElementById('header_help_icon');
  const URL = window.location.href;
  if (URL.endsWith('help.html')) {
    headerHelpIcon.classList.add('opaque');
  }
}

/**
 * This function uses 'toggle' to show or hide elements;
 * When clicking on 'Go to SignUp', email and password no longer have 'required'
 * Returning to the Login Screen restores the 'required' for email and password
 *
 * @param {String} buttonID - This is the ID of the clicked button ('goToSignUp'-button or 'backToLogin'-button)
 */
function toggleSignUpAndLogin(buttonID) {
  const LOGIN_CONTENT_BOX = document.getElementById('login_content');
  const SIGN_UP_CONTENT_BOX = document.getElementById('sign_up_content');
  const NOT_A_JOIN_USER_BOX = document.getElementById('sign_up_wrapper');
  LOGIN_CONTENT_BOX.classList.toggle('d-none');
  SIGN_UP_CONTENT_BOX.classList.toggle('d-none');
  NOT_A_JOIN_USER_BOX.classList.toggle('d-none');

  if (buttonID == 'goToSignUp_Btn') {
    document.getElementById('email_Login').removeAttribute('required');
    document.getElementById('password_Login').removeAttribute('required');
  } else if (buttonID == 'backToLogin_Btn' || !buttonID) {
    document.getElementById('email_Login').setAttribute('required', '');
    document.getElementById('password_Login').setAttribute('required', '');
  }
}

/**
 * If the current page is 'summary.html', the function initSummary() is called
 */
function checkIfSummaryPage() {
  const URL = window.location.href;
  if (URL.endsWith('summary.html')) {
    initSummary();
  }
}

/**
 * If the current page is 'index.html', the function initSummary() is called
 */
function checkIfStartScreen() {
  const URL = window.location.href;
  if (URL.endsWith('index.html')) {
    initRegister();
  }
}

/**
 * If the current page is 'board.html', the function initBoard() is called
 */
function checkIfBoardPage() {
  const URL = window.location.href;
  if (URL.endsWith('board.html')) {
    initBoard();
  }
}

/**
 * On all pages (except index.html), the header displays the user's initials (or 'G' for guests)
 * We check the localStorage for the user name and then look for the first letters of the first and last names
 */
function showInitials() {
  const URL = window.location.href;
  if (URL.endsWith('index.html')) {
    return;
  } else {
    let userNameAsString = localStorage.getItem('userName');
    if (userNameAsString) {
      let userName = JSON.parse(userNameAsString);
      let nameArray = userName.split(' ');
      let firstLetter = nameArray[0].charAt(0);
      let secondLetter = nameArray[1].charAt(0);
      document.getElementById('user_icon').innerHTML =
        firstLetter.concat(secondLetter);
    } else {
      document.getElementById('user_icon').innerHTML = 'G';
    }
  }
}

/**
 * This function is called when clicking on 'Logout';
 * the localStorage is cleared and the user returns to the login screen
 */
function logout() {
  localStorage.removeItem('userLogin');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('alreadyGreeted');
  window.location.href = 'index.html';
}

function showAndHideBoxesAccordingToScreenSize() {
  const SMALL_SCREEN_ELEMENTS = [
    'prio_small_screen',
    'due_date_small_screen',
    'category_small_screen',
    'sub_tasks_small_screen',
    'subtask_container_small',
  ];

  const BIG_SCREEN_ELEMENTS = ['big_screen'];
  const windowSize = window.innerWidth;
  const showClass = (element) =>
    document.getElementById(element).classList.remove('d-none');
  const hideClass = (element) =>
    document.getElementById(element).classList.add('d-none');
  SMALL_SCREEN_ELEMENTS.forEach((element) =>
    windowSize < 800 ? showClass(element) : hideClass(element)
  );
  BIG_SCREEN_ELEMENTS.forEach((element) =>
    windowSize >= 800 ? showClass(element) : hideClass(element)
  );
}

/**
 * Toggles dropdown lists on add tasks page by displaying all available options
 * of the dropdown list and rotating the arrow 180 deg
 * Shows an option to add a new task category resp a new contact
 * @param {string} idContainer - represents the container that holds the list of options
 * @param {string} idArrow  - represents the img element with the arrow
 */
function toggleDropdownLists(idContainer, idArrow, event) {
  event.stopPropagation();
  const CATEGORY_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_LIST.classList.toggle('show');
  SELECT_ARROW.classList.toggle('turn');
  if (
    idContainer === 'category_list_small' ||
    idContainer === 'category_list_big'
  ) {
    addCategoriesEventListeners();
  }
}

function combinedClickFunction() {
  closeDropdownList('category_list_small', 'select_arrow_categories_small');
  closeDropdownList('category_list_big', 'select_arrow_categories_big');
  closeDropdownList('contact_list', 'select_arrow_contacts');
  // Weitere Funktionen...
}

function openDropdownList(idContainer, idArrow, event) {
  event.stopPropagation();
  // Hier fügst du den Code für das Öffnen der Dropdown-Liste hinzu
  const CATEGORY_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_LIST.classList.add('show');
  SELECT_ARROW.classList.add('turn');
  console.log('Dropdown-Liste geöffnet');
}

function closeDropdownList(idContainer, idArrow) {
  const CATEGORY_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_LIST.classList.remove('show');
  SELECT_ARROW.classList.remove('turn');
}

function addCategoriesEventListeners() {
  for (let i = 0; i < allCategories.length; i++) {
    const categoryWrapperSmall = document.getElementById(
      `icon_and_category_wrapper_small_${i}`
    );
    const categoryWrapperBig = document.getElementById(
      `icon_and_category_wrapper_big_${i}`
    );
    categoryWrapperSmall.addEventListener('click', function () {
      removeCategoryWarning();
    });
    categoryWrapperBig.addEventListener('click', function () {
      removeCategoryWarning();
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  showAndHideBoxesAccordingToScreenSize();
  window.addEventListener('resize', showAndHideBoxesAccordingToScreenSize);
});

function renderCategories() {
  CATEGORY_LIST_SMALL.innerHTML = '';
  CATEGORY_LIST_BIG.innerHTML = '';
  let i;
  for (i = 0; i < allCategories.length; i++) {
    const currentCategory = allCategories[i];
    CATEGORY_LIST_SMALL.innerHTML += generateCategoryListHTML(
      i,
      currentCategory,
      'small'
    );
    CATEGORY_LIST_BIG.innerHTML += generateCategoryListHTML(
      i,
      currentCategory,
      'big'
    );
  }
  CATEGORY_LIST_SMALL.innerHTML += generateNewCategoryBoxHTML(i, 'small');
  CATEGORY_LIST_BIG.innerHTML += generateNewCategoryBoxHTML(i, 'big');
}

function selectTaskCategory(currentCategoryName, currentCategoryColor) {
  let selectedCategory = {
    category_name: currentCategoryName,
    category_color: currentCategoryColor,
  };

  currentCategories[0] = selectedCategory;
  renderCurrentCategory();
  closeCategoryLists(`category_list_small`, `select_arrow_categories_small`);
  closeCategoryLists(`category_list_big`, `select_arrow_categories_big`);
}

function deleteCategory(i) {
  let categoryToBeDeleted = allCategories[i];
  let categoryIndex = currentCategories.findIndex(function (item) {
    return item.category_name === categoryToBeDeleted.category_name;
  });
  allCategories.splice(i, 1);
  if (categoryIndex === 0) {
    currentCategories.splice(categoryIndex, 1);
    renderCurrentCategory();
  }
  renderCategories();
  closeCategoryLists(`category_list_small`, `select_arrow_categories_small`);
  closeCategoryLists(`category_list_big`, `select_arrow_categories_big`);
}

function closeCategoryLists(idContainer, idArrow) {
  const CATEGORY_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  CATEGORY_LIST.classList.remove('show');
  SELECT_ARROW.classList.remove('turn');
}

function renderCurrentCategory() {
  SELECT_TASK_CATEGORY_ELEMENT_SMALL.innerHTML = '';
  SELECT_TASK_CATEGORY_ELEMENT_BIG.innerHTML = '';
  if (currentCategories.length > 0) {
    const currentCategoryName = currentCategories[0].category_name;
    const currentCategoryColor = currentCategories[0].category_color;
    SELECT_TASK_CATEGORY_ELEMENT_SMALL.innerHTML = generateCurrentCategoryHTML(
      currentCategoryName,
      currentCategoryColor
    );
    SELECT_TASK_CATEGORY_ELEMENT_BIG.innerHTML = generateCurrentCategoryHTML(
      currentCategoryName,
      currentCategoryColor
    );
  } else {
    SELECT_TASK_CATEGORY_ELEMENT_SMALL.innerHTML = 'Select task category';
    SELECT_TASK_CATEGORY_ELEMENT_BIG.innerHTML = 'Select task category';
  }
}

function editCategory(
  i,
  currentCategoryName,
  currentCategoryColor,
  containerType
) {
  const categoryElement = document.getElementById(
    `category_item_${containerType}_${i}`
  );
  categoryElement.innerHTML = '';
  categoryElement.innerHTML = generateCategoryInputHTML(
    i,
    currentCategoryName,
    currentCategoryColor,
    containerType
  );
  changeInputBackgroundColor(i, containerType, 'color_input');
}

function changeInputBackgroundColor(i, containerType, containerID) {
  const colorInputField = document.getElementById(
    `${containerID}_${containerType}_${i}`
  );
  colorInputField.style.backgroundColor = colorInputField.value;
  colorInputField.addEventListener('input', function () {
    this.style.backgroundColor = this.value;
  });
}

function changeCategoryTextAndColor(i, containerType) {
  let colorInputField = document.getElementById(
    `color_input_${containerType}_${i}`
  );
  let categoryTextInputField = document.getElementById(
    `category_input_${containerType}_${i}`
  );
  colorInputField.style.backgroundColor = `${colorInputField.value}`;
  if (categoryTextInputField.value !== '') {
    let updatedCategory = {
      category_name: categoryTextInputField.value.trim(),
      category_color: colorInputField.value,
    };
    allCategories[i] = updatedCategory;
    renderCategories();
  } else {
    renderAlert(
      'alert_container',
      'alert_content',
      'Please enter a category name!'
    );
    renderCategories();
  }
}

function createNewCategory(i, containerType) {
  const randomColor = getRandomColor();
  const newCategoryBox = document.getElementById(
    `new_category_${containerType}`
  );
  newCategoryBox.innerHTML = '';
  newCategoryBox.innerHTML = generateInputForNewCategoryHTML(
    i,
    containerType,
    randomColor
  );
  changeInputBackgroundColor(i, containerType, 'color_new_input');
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addNewCategory(i, containerType) {
  let newCategoryColor = document.getElementById(
    `color_new_input_${containerType}_${i}`
  );
  let newCategoryText = document.getElementById(
    `category_new_input_${containerType}`
  );
  let categoryIndex = allCategories.findIndex(function (item) {
    return item.category_name === newCategoryText.value;
  });
  if (newCategoryText.value !== '') {
    if (categoryIndex === -1) {
      let newCategory = {
        category_name: newCategoryText.value.trim(),
        category_color: newCategoryColor.value,
      };
      allCategories.push(newCategory);
      renderCategories();
    } else {
      renderAlert(
        'alert_container',
        'alert_content',
        'This category already exists! Please choose another category name.'
      );
      renderCategories();
    }
  } else {
    renderAlert(
      'alert_container',
      'alert_content',
      'Please enter a new category name!'
    );
    renderCategories();
  }
}

function renderContacts() {
  CONTACT_LIST_BOX.innerHTML = '';
  CONTACT_LIST_BOX.innerHTML += generateSelectAllHTML();
  for (i = 0; i < allContacts.length; i++) {
    const oneContact = allContacts[i];
    CONTACT_LIST_BOX.innerHTML += generateContactListHTML(i, oneContact);
    adaptInitialsToBackground(`initials_icon_in_list_${i}`);
  }
}

function selectAndUnselectAllContacts(
  i,
  contactCheckbox,
  oneContact,
  checkAllCheckbox
) {
  let individualCheckboxes = document.getElementById(`contact_checkbox_${i}`);
  currentContacts = [];

  if (checkAllCheckbox.checked && !individualCheckboxes.checked) {
    individualCheckboxes.checked = true;
    for (let j = 0; j < allContacts.length; j++) {
      const newContact = allContacts[j];
      if (
        !currentContacts.some((existingContact) =>
          areContactsEqual(existingContact, newContact)
        )
      ) {
        currentContacts.push(newContact);
      }
    }
  } else if (!checkAllCheckbox.checked && individualCheckboxes.checked) {
    individualCheckboxes.checked = false;
  }
  selectContacts(contactCheckbox, oneContact);
  renderCurrentContacts();
}

function areContactsEqual(contact1, contact2) {
  return isEqual(contact1, contact2);
}

function addCheckboxEventListeners() {
  for (let i = 0; i < allContacts.length; i++) {
    const contactCheckbox = document.getElementById(`contact_checkbox_${i}`);
    const checkAllCheckbox = document.getElementById('select_all_checkbox');
    let oneContact = allContacts[i];
    contactCheckbox.addEventListener('change', function () {
      selectContacts(contactCheckbox, oneContact);
    });
    checkAllCheckbox.addEventListener('change', function () {
      selectAndUnselectAllContacts(
        i,
        contactCheckbox,
        oneContact,
        checkAllCheckbox
      );
    });
  }
}

function selectContacts(contactCheckbox, oneContact) {
  let selectedContact = {
    name: oneContact.name,
    e_mail: oneContact.e_mail,
    phone: oneContact.phone,
    color: oneContact.color,
  };
  currentContacts = currentContacts.filter(
    (existingContact) => !isEqual(existingContact, selectedContact)
  );
  if (contactCheckbox.checked == true) {
    currentContacts.push(selectedContact);
  }
  renderCurrentContacts();
}

function isEqual(obj1, obj2) {
  const entries1 = Object.entries(obj1);
  const entries2 = Object.entries(obj2);
  if (entries1.length !== entries2.length) {
    return false;
  }
  for (let i = 0; i < entries1.length; i++) {
    const key = entries1[i][0];
    const value = entries1[i][1];
    if (value !== obj2[key]) {
      return false;
    }
  }
  return true;
}

function renderCurrentContacts() {
  const contactsContainer = document.getElementById('contacts_container');
  contactsContainer.innerHTML = '';
  const maxWidth = contactsContainer.offsetWidth;
  let visibleContacts = currentContacts.slice();
  let hiddenContactsCount = 0;

  while (
    calculateTotalWidth(visibleContacts) > maxWidth &&
    visibleContacts.length > 1
  ) {
    hiddenContactsCount++;
    visibleContacts.pop();
  }
  for (let i = 0; i < visibleContacts.length; i++) {
    const oneContact = visibleContacts[i];
    contactsContainer.innerHTML += generateContactsIconsHTML(i, oneContact);
    adaptInitialsToBackground(`initials_icon_assigned_${i}`);
  }
  if (hiddenContactsCount > 0) {
    const overflowIndicatorHTML =
      generateOverflowIndicatorHTML(hiddenContactsCount);
    contactsContainer.innerHTML += overflowIndicatorHTML;
  }
}

function calculateTotalWidth(contacts) {
  const contactWidth = 25;
  return contacts.length * contactWidth;
}

window.addEventListener('resize', function () {
  renderCurrentContacts();
});

function renderAlert(containerId, messageId, alertMessage) {
  openOrCloseAlertContainer(containerId, 'open');
  const alertContent = document.getElementById(messageId);
  alertContent.innerHTML = '';
  if (containerId === 'alert_container') {
    alertContent.innerHTML = generateAlertContentHTML(alertMessage);
  } else if (containerId === 'confirm_container') {
    console.log('tasks', tasks);
    alertContent.innerHTML = generateConfirmContentHTML(alertMessage);
  }
}

function renderConfirmDelete(i, containerId, messageId, alertMessage) {
  openOrCloseAlertContainer(containerId, 'open');
  const confirmContent = document.getElementById(messageId);
  confirmContent.innerHTML = '';
  console.log('tasks', tasks);
  confirmContent.innerHTML = generateConfirmContentHTML(i, alertMessage);
}

function openOrCloseAlertContainer(containerId, action) {
  const alertContainer = document.getElementById(containerId);
  if (action === 'open') {
    alertContainer.classList.remove('d-none');
  } else if (action === 'close') {
    alertContainer.classList.add('d-none');
  }
}

function generateAlertContentHTML(alertMessage) {
  return /* html */ `
    <div class="alert-message">${alertMessage}</div>
  `;
}

function generateConfirmContentHTML(i, alertMessage) {
  return /* html */ `
    <div class="alert-message">${alertMessage}</div>
    <div id="confirm_button_wrapper" class="confirm-button-wrapper">
      <button onclick="deleteTask(${i})" class="dark-button">Yes, proceed</button>
      <button onclick="openOrCloseAlertContainer('confirm_container', 'close')" class="dark-button">No, preserve</button>
    </div>
  `;
}

/* function createAlertContainer(containerId, alertMessage, closeFunction) {
  // containerId
  let outerContainer = document.createElement('div');
  outerContainer.id = containerId; // containerId;
  outerContainer.className = 'alert-container';
  let imageWrapper = document.createElement('div');
  imageWrapper.className = 'alert-image-wrapper';
  let logo = document.createElement('img');
  logo.className = 'alert-logo';
  logo.src = '../icons/join_logo_white.svg';
  let titleElement = document.createElement('h3');
  titleElement.innerText = 'Alert';
  let closeButton = document.createElement('img');
  closeButton.className = 'alert-close';
  closeButton.src = '../icons/close_white.svg';
  closeButton.onclick = function () {
    openOrCloseAlertContainer(containerId, 'close'); // containerId
    if (closeFunction) {
      closeFunction(outerContainer);
    }
  };
  imageWrapper.appendChild(logo);
  imageWrapper.appendChild(titleElement);
  imageWrapper.appendChild(closeButton);
  let contentContainer = document.createElement('div');
  contentContainer.id = 'alert_content';
  contentContainer.className = 'alert-content';
  contentContainer.innerHTML = alertMessage;
  outerContainer.appendChild(imageWrapper);
  outerContainer.appendChild(contentContainer);
  document.body.appendChild(outerContainer);
}

// Beispielaufruf der Funktion
createAlertContainer(
  'alert_container',
  'Please enter a category name!',
  function () {}
);

function openOrCloseAlertContainer(containerId, action) {
  const container = document.getElementById(containerId);
  if (action === 'close') {
    container.remove();
  }
} */

function adaptInitialsToBackground(containerID) {
  const iconContainer = document.getElementById(containerID);
  const iconColor = getComputedStyle(iconContainer).backgroundColor;
  const isLight = isColorLight(iconColor);

  if (isLight) {
    iconContainer.style.color = '#000000';
  } else {
    iconContainer.style.color = '#ffffff';
  }
}

function isColorLight(color) {
  const rgb = color.match(/\d+/g).map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 128;
}
