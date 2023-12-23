let userLogin = false;                  // Wird true, wenn UserLogin (also kein GuestLogin)
let greetedMobile = false;    


function initSummary() {
    checkLocalStorage();
    greetUser();
    greetingMobile();
    saveLoginType();
}


function greetUser() {
    document.getElementById('greeting').innerHTML = getDaytime();  
    if(userLogin) {
        document.getElementById('greeting_name').innerHTML = 'Sofia Müller';  // = getUserName();  
    }
}


function getDaytime() {
    let dayTime = new Date().getHours();
    let greeting = greet(dayTime);
    return greeting;
}


function greet(dayTime) {
    if(dayTime < 12) {                 
        if(userLogin){
            return 'Good morning,'
        } else {
            return 'Good morning'
        }
    } else if (dayTime >= 12 && dayTime < 18) {
        if(userLogin) {
            return 'Good afternoon,'
        } else {
            return 'Good afternoon'
        }
    } else {
        if(userLogin) {
            return 'Good evening,'
        } else {
            return 'Good evening'
        }
    }
}


function getUserName() {
    
}


function greetingMobile() {
    let windowWidth = window.innerWidth;
    if(windowWidth < 800  && !greetedMobile) {     // Animation nur bei mobilen Geräten und auch nur 1 Mal nach Login
        showMobileWelcomeScreen();
    } else {
        showSummary();
    }
}


function showMobileWelcomeScreen() {
    let greeting = document.getElementById('greeting').innerHTML;
        if(userLogin) {
            greetUserMobile(greeting);
        } else {
            greetGuestMobile(greeting);
        }
        mobileScreenAnimation();
}


function showSummary() {
    document.getElementById('main').style.display = 'block';
    document.getElementById('main').style.opacity = 1;
}


function greetUserMobile(greeting) {
    document.getElementById('greeting_mobile').innerHTML = greeting;
    let greetingName = document.getElementById('greeting_name').innerHTML;
    document.getElementById('greeting_name_mobile').innerHTML = greetingName;
}


function greetGuestMobile(greeting) {
    document.getElementById('greeting_mobile').innerHTML = `${greeting}!`;
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

    let greetedMobileAsString = localStorage.getItem('alreadyGreeted');
    if(greetedMobileAsString) {
        greetedMobile = JSON.parse(greetedMobileAsString);
    }
}

