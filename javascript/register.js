let registerBtn = document.getElementById('register_btn');
let fullName = document.getElementById('name_SignUp');
let email = document.getElementById('email_SignUp');
let password = document.getElementById('password_SignUp');
let confirmPassword = document.getElementById('confirmPassword_SignUp');
let users = [];


async function initRegister(){
    await loadUsers();
}


async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}


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
                await setItem('users', JSON.stringify(users));
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


function bothPasswordsMatch() {
    if(password.value === confirmPassword.value) {
        return true;
    } else {
        return false;
    }
}


function passwordMinimumLength() {
    if((password.value).length >= 6) {
        return true;
    } else {
        return false;
    }
}


function notAUser() {                      
    let emailInput = document.getElementById('email_SignUp').value;
    let user = users.find(u => u.email == emailInput);
    if(!user) {                    
        return true;
    } else if(user) {              
        return false;
    }
}


function resetForm() {
    fullName.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    registerBtn.disabled = false;
}


function successfullyRegistered() {
    document.getElementById('messageBox').style.display = 'block';
    setTimeout(() => {
        document.getElementById('messageBox').style.display = 'none';
        toggleSignUpAndLogin();
    }, 2000); 
}

