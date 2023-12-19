let userLogin = false;

function greetUser() {
    document.getElementById('greeting').innerHTML = getDaytime();  
    document.getElementById('greeting_name').innerHTML = 'Sofia Müller';   
}


function getDaytime() {
    let dayTime = new Date().getHours();

    if(dayTime < 12) {
        return 'Good morning,'
    } else if (dayTime >= 12 && dayTime < 18) {
        return 'Good afternoon,'
    } else {
        return 'Good evening,'
    }
}


// guestLogin oder angemeldeter User ? Dementsprechender Name bei Greeting (WELCHER User ?); 
// wenn GuestLogin kein Name und kein Komma in Begrüßung