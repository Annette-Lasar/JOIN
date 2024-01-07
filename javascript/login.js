function login() {
    let email = document.getElementById('email_Login').value;
    let password = document.getElementById('password_Login').value;
    let user = users.find(u => u.email == email && u.password == password);
    if(user) {
        loginSuccessful(user);
        window.location.href = 'summary.html';   
    } else {
        alert('User not found or login credentials incorrect !'); 
    }
}


function loginSuccessful(user) {
    let successfulLogin = true;
    successfulLogin = JSON.stringify(successfulLogin);
    localStorage.setItem('userLogin', successfulLogin); 
    
    let userName = user.name;
    userName = JSON.stringify(userName);
    localStorage.setItem('userName', userName);

    let userEmail = user.email;
    userEmail = JSON.stringify(userEmail);
    localStorage.setItem('userEmail', userEmail);
}

