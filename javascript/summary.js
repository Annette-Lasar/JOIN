let userLogin = true;


function greetUser() {
    document.getElementById('greeting').innerHTML = getDaytime();  
    if(userLogin) {
        document.getElementById('greeting_name').innerHTML = 'Sofia Müller';  // = getUserName();  
    }
}


function getDaytime() {
    let dayTime = new Date().getHours();

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


// UserLogin: Dementsprechender Name bei Greeting (WELCHER User ?)
// GuestLogin: kein Name und kein Komma in Begrüßung