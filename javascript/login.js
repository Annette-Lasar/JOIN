/**
 * Function called when clicking 'Login'
 * we read the fields of email and password, then search for this user in the array 'users'
 * if the user is found, the user data is stored in localStorage, and the user is redirected to summary.html
 */
async function login() {
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


/**
 * user data is stored in localStorage
 * 
 * @param {JSON} user - The user from the 'users' array who has just logged in
 */
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

