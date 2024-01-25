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
 * if guest-Login, the original guest-Arrays are sent back to the server;
 * the localStorage is cleared and the user returns to the login screen
 */
async function logout() {
  let userLogin = localStorage.getItem('userLogin');
  if (userLogin == 'false') {
    await setItem('guestTasks', JSON.stringify(tasksGuest));
    await setItem('guestContacts', JSON.stringify(allContacts));
    await setItem('guestCategories', JSON.stringify(allCategories));
  }
  localStorage.removeItem('userLogin');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('alreadyGreeted');
  window.location.href = 'index.html';
}

function showAndHideBoxesAccordingToScreenSize() {
  const url = window.location.href;
  const SMALL_SCREEN_ELEMENTS = [
    'prio_small_screen',
    'due_date_small_screen',
    'category_small_screen',
    'sub_tasks_small_screen',
    'subtask_container_small',
  ];
  const BIG_SCREEN_ELEMENTS = ['big_screen'];
  const windowSize = window.innerWidth;
  if (url.endsWith('board.html') || url.endsWith('add_task.html')) {
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

function combinedClickFunction(event) {
  if (
    event.target.closest('.contact-list-element') == null &&
    event.target.closest('.category-item') == null &&
    event.target.closest('.category-icon-wrapper') == null &&
    event.target.closest('.new-category-plus') == null &&
    event.target.closest('.new-category') == null &&
    event.target.closest('.close-and-check-wrapper-edit-subtask') == null
  ) {
    closeDropdownList(
      'category_list_small',
      'select_arrow_categories_small',
      event
    );
    closeDropdownList(
      'category_list_big',
      'select_arrow_categories_big',
      event
    );
    closeDropdownList('contact_list', 'select_arrow_contacts', event);
  }
}

function closeDropdownList(idContainer, idArrow, event) {
  event.stopPropagation();
  const CATEGORY_LIST = document.getElementById(idContainer);
  const SELECT_ARROW = document.getElementById(idArrow);
  if (CATEGORY_LIST && SELECT_ARROW) {
    CATEGORY_LIST.classList.remove('show');
    SELECT_ARROW.classList.remove('turn');
  }
}

function addCategoriesEventListeners() {
  for (let i = 0; i < categories.length; i++) {
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

function renderAlert(containerId, messageId, alertMessage) {
  openOrCloseAlertContainer(containerId, 'open');
  const alertContent = document.getElementById(messageId);
  alertContent.innerHTML = '';
  if (containerId === 'alert_container') {
    alertContent.innerHTML = generateAlertContentHTML(alertMessage);
  } else if (containerId === 'confirm_container') {
    alertContent.innerHTML = generateConfirmContentHTML(alertMessage);
  }
}

function renderConfirmDelete(i, containerId, messageId, alertMessage) {
  openOrCloseAlertContainer(containerId, 'open');
  const confirmContent = document.getElementById(messageId);
  confirmContent.innerHTML = '';
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
