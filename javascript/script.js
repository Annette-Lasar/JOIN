async function init() {
  moveLogoOnStartScreen();
  await includeHTML();
  hideHelpLinkOnHelpPage();
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
      document.getElementById('login_page').classList.add('change-background-color');
      document.getElementById('login_join_logo').classList.add('animate-logo');
      document.getElementById('path_dot').classList.add('change-logo-color');
      document.getElementById('path_j').classList.add('change-logo-color');
      document.getElementById('path_o').classList.add('change-logo-color');
      document.getElementById('path_i').classList.add('change-logo-color');
      document.getElementById('path_n').classList.add('change-logo-color');
    }, 500);
  }
}


function hideHelpLinkOnHelpPage() {
  let headerHelpIcon = document.getElementById('header_help_icon');
  const URL = window.location.href;
  if (URL.endsWith('help.html')) {
    headerHelpIcon.classList.add('opaque');
  }
}


function toggleSignUpAndLogin(buttonID) {
  const LOGIN_CONTENT_BOX = document.getElementById('login_content');
  const SIGN_UP_CONTENT_BOX = document.getElementById('sign_up_content');
  const NOT_A_JOIN_USER_BOX = document.getElementById('sign_up_wrapper');
  LOGIN_CONTENT_BOX.classList.toggle('d-none');
  SIGN_UP_CONTENT_BOX.classList.toggle('d-none');
  NOT_A_JOIN_USER_BOX.classList.toggle('d-none');

  if(buttonID == 'goToSignUp_Btn') {
    document.getElementById('email_Login').removeAttribute('required');
    document.getElementById('password_Login').removeAttribute('required');
  } else if(buttonID == 'backToLogin_Btn' || !buttonID) {
    document.getElementById('email_Login').setAttribute('required', '');
    document.getElementById('password_Login').setAttribute('required', '');
  }
}


function checkIfSummaryPage() {
  const URL = window.location.href;
  if (URL.endsWith('summary.html')) {
    initSummary();
  }
}


function checkIfStartScreen() {
  const URL = window.location.href;
  if (URL.endsWith('index.html')) {
    initRegister();
  }
}


function checkIfBoardPage() {
  const URL = window.location.href;
  if(URL.endsWith('board.html')) {
    initBoard();
  }
}


function showInitials() {
  const URL = window.location.href;
  if(URL.endsWith('index.html')){
    return;
  } else {
    let userNameAsString = localStorage.getItem('userName');
    if(userNameAsString) {
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
*  bei Klick auf 'Logout'
*  die Daten im localStorage müssen unbedingt wieder gelöscht werden ( localStorage.removeItem(key) ) 
*  Function logout() muss noch richtig implementiert werden bei Klick auf Logout (vorübergehend oben im header auf den eigenen Initialien platziert) 
*  Function wahrscheinlich noch nicht final;
*/
function logout() {
  localStorage.removeItem('userLogin');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('alreadyGreeted');
  window.location.href = 'index.html';
}

function renderAlert(alertMessage) {
  openAlertContainer();
  const alertContent = document.getElementById('alert_content');
  alertContent.innerHTML = '';
  alertContent.innerHTML = generateAlertContentHTML(alertMessage);
}

function openAlertContainer() {
  const alertContainer = document.getElementById('alert_container');
  alertContainer.classList.remove('d-none');
}

function closeAlertContainer() {
  const alertContainer = document.getElementById('alert_container');
  alertContainer.classList.add('d-none');
}