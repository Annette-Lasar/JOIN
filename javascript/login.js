function login() {
    

    loginSuccessful();
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

