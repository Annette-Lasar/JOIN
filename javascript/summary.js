let userLogin = false;

function greetUser() {
    document.getElementById('greeting').innerHTML = getDaytime();  
    document.getElementById('greeting_name').innerHTML = 'Sofia Müller';  // = getUserName();  nur bei UserLogin
}


function getDaytime() {
    let dayTime = new Date().getHours();

    if(dayTime < 12) {                 // verschachtelte if-Abfrage: if(userLogin) { ..... } else { return 'Good morning'} (ohne Komma)
        return 'Good morning,'
    } else if (dayTime >= 12 && dayTime < 18) {
        return 'Good afternoon,'
    } else {
        return 'Good evening,'
    }
}


function getUserName() {

}


// UserLogin: Dementsprechender Name bei Greeting (WELCHER User ?); 
// GuestLogin: kein Name und kein Komma in Begrüßung