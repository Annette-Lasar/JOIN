let registerBtn = document.getElementById('register_btn');
let fullName = document.getElementById('name_SignUp');
let email = document.getElementById('email_SignUp');
let password = document.getElementById('password_SignUp');
let confirmPassword = document.getElementById('confirmPassword_SignUp');
let users = [];


/**
 * This function is called when you are on the 'SignUp' page and click on 'SignUp' after entering your new user data
 */
async function initRegister(){
    await loadUsers();
}


/**
 * First, all registered users are loaded from the server; on the server, they are stored under the key 'users'
 */
async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}


/**
 * Both passwords must match, and the password needs to be at least 6 characters long;
 * Additionally, the user account must not already exist;
 * If all conditions are met, the user is pushed into the 'users' array
 */
async function register() {
    if(bothPasswordsMatch()) {
        if(passwordMinimumLength()) {
            if(notAUser()) {
                registerBtn.disabled = true;
                users.push({
                    name: fullName.value,
                    email: email.value,
                    password: password.value
                });
                await sendNewDataToServer();
                resetForm();
                successfullyRegistered();
            } else {
                alert('Email address already registered !');
            }
         } else {
               alert('Minimum password length is 6 characters !');
            }
        } else {
            alert('Both passwords must match !');
        }
}


/**
 * Both passwords must match
 * 
 * @returns {Boolean}
 */
function bothPasswordsMatch() {
    if(password.value === confirmPassword.value) {
        return true;
    } else {
        return false;
    }
}


/**
 * password needs to be at least 6 characters long
 * 
 * @returns {Boolean}
 */
function passwordMinimumLength() {
    if((password.value).length >= 6) {
        return true;
    } else {
        return false;
    }
}


/**
 * the user account must not already exist, so we check whether the entered email address already exists
 * 
 * @returns 
 */
function notAUser() {                      
    let emailInput = document.getElementById('email_SignUp').value;
    let user = users.find(u => u.email == emailInput);
    if(!user) {                    
        return true;
    } else if(user) {              
        return false;
    }
}

/**
 * the 'users' array is then sent back to the server;
 * Additionally, 3 keys are created on the server for each user (in the form of their email address); 
 * Under these keys, their tasks, contacts and categories will be stored in an array in the future
 */
async function sendNewDataToServer() {
    await setItem('users', JSON.stringify(users));
    await setItem(`${email.value}_tasks`, []);
    await setItem(`${email.value}_contacts`, []);
    await setItem(`${email.value}_categories`, []);
}


/**
 * we have to clear the form
 */
function resetForm() {
    fullName.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    registerBtn.disabled = false;
}


/**
 * This function is called once the user has successfully registered;
 * A success message is displayed, and after 2 seconds, this message disappears and we return to the login screen
 */
function successfullyRegistered() {
    document.getElementById('messageBox').style.display = 'block';
    setTimeout(() => {
        document.getElementById('messageBox').style.display = 'none';
        toggleSignUpAndLogin();
    }, 2000); 
}

