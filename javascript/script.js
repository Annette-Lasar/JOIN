async function init() {
  moveLogoOnStartScreen();
  await includeHTML();
  hideHelpLinkOnHelpPage();
  hideNavIconsOnExternalSites();
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
  const URL = window.location.href;
  if (URL.endsWith('external.html')) {
    menuWrapper.style.display = 'none';
    legalNoticeLink.href = './legal_notice_external.html';
    privacyPolicyLink.href = './privacy_policy_external.html';
  }
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
      document.getElementById('user_icon').innerHTML = firstLetter.concat(secondLetter);
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

