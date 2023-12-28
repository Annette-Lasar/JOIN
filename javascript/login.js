function login() {
    let email = document.getElementById('email_Login').value;
    let password = document.getElementById('password_Login').value;
    let user = users.find(u => u.email == email && u.password == password);
    if(user) {
        console.log(user);
        loginSuccessful();
        // hier noch Weiterleitung zu summary.html
    } else {
        alert('User nicht gefunden !');   // Platzhalter; alert noch durch einen richtigen Hinweis ersetzen
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

