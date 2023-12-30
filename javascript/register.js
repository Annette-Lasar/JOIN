let registerBtn = document.getElementById('register_btn');
let fullName = document.getElementById('name_SignUp');
let email = document.getElementById('email_SignUp');
let password = document.getElementById('password_SignUp');
let confirmPassword = document.getElementById('confirmPassword_SignUp');
let users = [];


async function initRegister(){
    loadUsers();
}


async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}

// hier noch zusätzlich prüfen, ob password mit confirmPassword übereinstimmt !
async function register() {
    registerBtn.disabled = true;
    users.push({
        name: fullName.value,
        email: email.value,
        password: password.value
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
    successfullyRegistered();
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
    }, 1500); 
}

