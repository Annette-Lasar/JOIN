const STORAGE_TOKEN = 'WD1QPQKHI4MOS1DQJR4CO2CZ2PYLN9D1ZQY7FT1H';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


async function init() {
  moveLogoOnStartScreen();
  await includeHTML();
  hideHelpLinkOnHelpPage();
  checkIfSummaryPage();
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

function hideHelpLinkOnHelpPage() {
  let headerHelpIcon = document.getElementById('header_help_icon');
  const URL = window.location.href;
  if (URL.endsWith('help.html')) {
    headerHelpIcon.classList.add('opaque');
  }
}

function toggleSignUpAndLogin() {
  const LOGIN_CONTENT_BOX = document.getElementById('login_content');
  const SIGN_UP_CONTENT_BOX = document.getElementById('sign_up_content');
  const NOT_A_JOIN_USER_BOX = document.getElementById('sign_up_wrapper');
  LOGIN_CONTENT_BOX.classList.toggle('d-none');
  SIGN_UP_CONTENT_BOX.classList.toggle('d-none');
  NOT_A_JOIN_USER_BOX.classList.toggle('d-none');
}

function checkIfSummaryPage() {
  const URL = window.location.href;
  if (URL.endsWith('summary.html')) {
    initSummary();
  }
}


/** 
*  folgende Function ist nur für erfolgreichen USER-Login, NICHT bei GuestLogin !
*  Name für key 'userLogin' wurde bewusst gewählt, da genau dieser key in summary.js abgerufen wird ( dort in der Function 'checkLocalStorage()' )
*  Function loginSuccessful() muss noch richtig implementiert werden in index.html (vorübergehend zu Testzwecken auf dem Login-Button platziert )
*  Function ist noch nicht final; zB noch Weiterleitung zu summary.html einbinden
*/
function loginSuccessful() {
  let successfulLogin = true;
  successfulLogin = JSON.stringify(successfulLogin);
  localStorage.setItem('userLogin', successfulLogin);   
}


/** 
*  bei Klick auf 'Logout'
*  die beiden keys 'userLogin' und 'alreadyGreeted' im localStorage müssen unbedingt wieder gelöscht werden ( localStorage.removeItem(key) ) 
*  Function logout() muss noch richtig implementiert werden bei Klick auf Logout (vorübergehend oben im header auf den eigenen Initialien platziert) 
*  Function noch nicht final; zB muss man wieder zur Anmeldemaske zurückkehren
*/
function logout() {
  localStorage.removeItem('userLogin');
  localStorage.removeItem('alreadyGreeted');
}

