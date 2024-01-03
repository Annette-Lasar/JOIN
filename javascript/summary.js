let userLogin = false;    
let userName;
let greetedMobile = false;   


function initSummary() {
    checkLocalStorage();
    greetUser();
    greetingMobile();
    saveLoginType();
    getSummaryValues();
}


function greetUser() {
    document.getElementById('greeting').innerHTML = getDaytime();  
    if(userLogin) {
        document.getElementById('greeting_name').innerHTML = userName; 
    } else {
        document.getElementById('greeting_name').innerHTML = 'Guest';
    }
}


function getDaytime() {
    let dayTime = new Date().getHours();
    let greeting = greet(dayTime);
    return greeting;
}


function greet(dayTime) {
    if(dayTime < 12) {                 
        return 'Good morning,'
    } else if (dayTime >= 12 && dayTime < 18) {
        return 'Good afternoon,'  
    } else {
        return 'Good evening,'
    }
}


function greetingMobile() {
    let windowWidth = window.innerWidth;
    if(windowWidth < 800  && !greetedMobile) {     
        showMobileWelcomeScreen();
    } else {
        showSummary();
    }
}


function showMobileWelcomeScreen() {
    let greeting = document.getElementById('greeting').innerHTML;
    greetMobile(greeting);
    mobileScreenAnimation();
}


function showSummary() {
    document.getElementById('main').style.display = 'block';
    document.getElementById('main').style.opacity = 1;
}


function greetMobile(greeting) {
    document.getElementById('greeting_mobile').innerHTML = greeting;
    let greetingName = document.getElementById('greeting_name').innerHTML;
    document.getElementById('greeting_name_mobile').innerHTML = greetingName;
}


function mobileScreenAnimation() {
    document.getElementById('startScreen_mobile').style.display = 'flex';
    setTimeout(() => document.getElementById('startScreen_mobile').classList.add('fadeOut'), 1000);
    setTimeout(() => {
        document.getElementById('startScreen_mobile').remove();
        document.getElementById('main').style.display = 'block';
        document.getElementById('main').classList.add('fadeIn');
    }, 2000);
    saveGreeting();
}


function saveGreeting() {
    greetedMobile = true;
    let greetedMobileAsString = JSON.stringify(greetedMobile);
    localStorage.setItem('alreadyGreeted', greetedMobileAsString);
}


function saveLoginType() {
    let userLoginAsString = JSON.stringify(userLogin);
    localStorage.setItem('userLogin', userLoginAsString);
}


function checkLocalStorage() {
    let userLoginAsString = localStorage.getItem('userLogin');
    if(userLoginAsString) {
        userLogin = JSON.parse(userLoginAsString);
    }
    let userNameAsString = localStorage.getItem('userName');
    if(userNameAsString) {
        userName = JSON.parse(userNameAsString);
    }
    let greetedMobileAsString = localStorage.getItem('alreadyGreeted');
    if(greetedMobileAsString) {
        greetedMobile = JSON.parse(greetedMobileAsString);
    }
}


function getSummaryValues() {

}

