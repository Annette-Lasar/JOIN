function login() {
    let email = document.getElementById('email_Login').value;
    let password = document.getElementById('password_Login').value;
    let user = users.find(u => u.email == email && u.password == password);
    if(user) {
        console.log(user);
        loginSuccessful(user);
        window.location.href = 'summary.html';   
    } else {
        alert('User nicht vorhanden oder Anmeldedaten nicht korrekt !'); 
    }
    
}


/** 
*  folgende Function ist nur für erfolgreichen USER-Login, NICHT bei GuestLogin !
*  Name für key 'userLogin' wurde bewusst gewählt, da genau dieser key in summary.js abgerufen wird ( dort in der Function 'checkLocalStorage()' )
*  Function loginSuccessful() muss noch richtig implementiert werden in index.html (vorübergehend zu Testzwecken auf dem Login-Button platziert )
*/
function loginSuccessful(user) {
    let successfulLogin = true;
    successfulLogin = JSON.stringify(successfulLogin);
    localStorage.setItem('userLogin', successfulLogin); 
    
    let userName = user.name;
    userName = JSON.stringify(userName);
    localStorage.setItem('userName', userName);
}

