function login() {
    let email = document.getElementById('email_Login').value;
    let password = document.getElementById('password_Login').value;
    let user = users.find(u => u.email == email && u.password == password);
    if(user) {
        loginSuccessful(user);
        window.location.href = 'summary.html';   
    } else {
        alert('User nicht vorhanden oder Anmeldedaten nicht korrekt !'); 
    }
    
}


function loginSuccessful(user) {
    let successfulLogin = true;
    successfulLogin = JSON.stringify(successfulLogin);
    localStorage.setItem('userLogin', successfulLogin); 
    
    let userName = user.name;
    userName = JSON.stringify(userName);
    localStorage.setItem('userName', userName);
}
