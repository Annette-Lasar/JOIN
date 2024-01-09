let userLogin = false;    
let userName;
let greetedMobile = false;   


function initSummary() {
    checkLocalStorage();
    greetUser();
    greetingMobile();
    saveLoginType();
    showSummaryValues();
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


async function showSummaryValues() {

    if(userLogin) {                                               
        let userEmail = localStorage.getItem('userEmail'); 
        userEmail = userEmail.replace(/"/g, '');      
        users = JSON.parse(await getItem('users'));
        let user = users.find(u => u.email === userEmail);
        if(user) {
            if(user['tasks'].length > 0) {
              tasks = JSON.parse(await getItem(user['tasks']));        // Task-Array des jeweiligen Users abrufen  
            } 
        }
    } else {
        tasks = JSON.parse(await getItem('guestTasks'));               // Gäste-Array abrufen und anzeigen
    }    

    
    let toDos = tasks.filter(t => t['status'] == 'toDo');
    let toDosCounter = toDos.length;
    document.getElementById('toDo_counter').innerHTML = toDosCounter;

    let done = tasks.filter(t => t['status'] == 'done');
    let doneCounter = done.length;
    document.getElementById('done_counter').innerHTML = doneCounter;

    let urgent = tasks.filter(t => t['current_prio'] == 'urgent');                        
    let urgentCounter = urgent.length;
    document.getElementById('urgent_counter').innerHTML = urgentCounter;

    let tasksInProgress = tasks.filter(t => t['status'] == 'inProgress');
    let inProgressCounter = tasksInProgress.length;
    document.getElementById('inProgress_counter').innerHTML = inProgressCounter;

    let awaitFeedback = tasks.filter(t => t['status'] == 'awaitFeedback');
    let awaitFeedbackCounter = awaitFeedback.length;
    document.getElementById('awaitFeedback_counter').innerHTML = awaitFeedbackCounter;

    let tasksInBoard = toDosCounter + inProgressCounter + awaitFeedbackCounter;
    document.getElementById('tasksInBoard_counter').innerHTML = tasksInBoard;


    // alle dates rausfiltern von Tasks, die 'urgent' sind und in Array 'urgentDeadlines' speichern
    let urgentDeadlines = [];
    tasks.forEach(task => { 
        if(task['current_prio'] == 'urgent') {                       // Nur Deadline filtern wenn Prio dieser Task 'urgent' ist
            urgentDeadlines.push(task['current_due_date']);          // Datum ist Pflichtfeld; also ist pro Task immer 1 Datum hinterlegt
        }
   });  
                                                                  
   if(urgentDeadlines.length == 0) {                                 // Keine Tasks vorhanden oder keine urgent Tasks
    document.getElementById('next_due_date').innerHTML = 'No urgent due dates';
   } else if(urgentDeadlines.length == 1) {                          // genau 1 urgent deadline vorhanden
    document.getElementById('next_due_date').innerHTML = urgentDeadlines[0];
   } else {                                                          // mehr als 1 urgent deadline vorhanden

    // herausfinden welches Datum am nähesten ist

    // das näheste Datum in die andere Schreibweise umwandeln

    // Datum in summary.js anzeigen

   }

}

