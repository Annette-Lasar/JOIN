let userLogin = false;    
let userName;
let greetedMobile = false;   

/**
 * This function is called as soon as summary.html is opened.
 * First, we check the 'userLogin' variable in localStorage to determine whether a user or a guest is logged in.
 * Depending on that, the user is greeted as a guest or by their name.
 * Additionally, it is checked whether it is the mobile view or the desktop view. In the mobile view, there is an additional greeting animation.
 * The login type is saved, and the summary overview is displayed.
 */
function initSummary() {
    checkLocalStorage();
    greetUser();
    greetingMobile();
    saveLoginType();
    showSummaryValues();
}


/**
 * the user is greeted as a guest or by their name; depending on the 'userLogin' variable in localStorage
 */
function greetUser() {
    document.getElementById('greeting').innerHTML = getDaytime();  
    if(userLogin) {
        document.getElementById('greeting_name').innerHTML = userName; 
    } else {
        document.getElementById('greeting_name').innerHTML = 'Guest';
    }
}


/**
 * This function checks the time of day to determine how the user should be greeted
 * @returns {String}  - This is 'Good morning', 'good afternoon' or 'good evening'
 */
function getDaytime() {
    let dayTime = new Date().getHours();
    let greeting = greet(dayTime);
    return greeting;
}


/**
 * 
 * @param {number} dayTime - The hours of the current time
 * @returns {String} - This is 'Good morning', 'good afternoon' or 'good evening'
 */
function greet(dayTime) {
    if(dayTime < 12) {                 
        return 'Good morning,'
    } else if (dayTime >= 12 && dayTime < 18) {
        return 'Good afternoon,'  
    } else {
        return 'Good evening,'
    }
}


/**
 * To determine whether it is the mobile view and whether the mobile animation has already been shown, 
 * we check the screen width and the 'greetedMobile' variable.
 */
function greetingMobile() {
    let windowWidth = window.innerWidth;
    if(windowWidth < 800  && !greetedMobile) {     
        showMobileWelcomeScreen();
    } else {
        showSummary();
    }
}


/**
 * We use the greeting in the mobile greeting animation
 */
function showMobileWelcomeScreen() {
    let greeting = document.getElementById('greeting').innerHTML;
    greetMobile(greeting);
    mobileScreenAnimation();
}


/**
 * Desktop view: We immediately display the summary overview; no mobile grreting animation
 */
function showSummary() {
    document.getElementById('main').style.display = 'block';
    document.getElementById('main').style.opacity = 1;
}


/**
 * This function shows the mobile greeting 
 * @param {String} greeting - This is 'Good morning', 'good afternoon' or 'good evening'
 */
function greetMobile(greeting) {
    document.getElementById('greeting_mobile').innerHTML = greeting;
    let greetingName = document.getElementById('greeting_name').innerHTML;
    document.getElementById('greeting_name_mobile').innerHTML = greetingName;
}


/**
 * The mobile start screen is set to 'display: flex'.
 * After 1 second, the screen fades out, and after 2 seconds, the summary is displayed
 */
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


/**
 * In localStorage, we store the information that the mobile animation has been shown at login
 * otherwise, the animation would be shown again every time;
 * however, this should only happen once after logging in
 */
function saveGreeting() {
    greetedMobile = true;
    let greetedMobileAsString = JSON.stringify(greetedMobile);
    localStorage.setItem('alreadyGreeted', greetedMobileAsString);
}


/**
 * in localStorage, we store the information whether a user or a guest is logged in
 */
function saveLoginType() {
    let userLoginAsString = JSON.stringify(userLogin);
    localStorage.setItem('userLogin', userLoginAsString);
}


/**
 * we check the 'userLogin' variable in localStorage to determine whether a user or a guest is logged in;
 * Additionally, we get the user's name and check whether the mobile greeting animation has already been played
 * 
 */
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


/**
 * First, depending on the login, we load the respective task array from the server;
 * Then, we display the values in the summary (ToDo's, Done, inProgress, etc...)
 */
async function showSummaryValues() {
    await loadTasksUserOrGuest();
    showCounter();
    showNextUrgentDeadline();
}


/**
 * We filter the 'tasks' array according to the respective status (toDo, done, inProgress, awaitFeedback);
 * In the final step, we want to know how many tasks have the priority 'urgent'.
 */
function showCounter() {
    let toDos = tasks.filter(t => t['status'] == 'toDo');
    let toDosCounter = toDos.length;
    document.getElementById('toDo_counter').innerHTML = toDosCounter;

    let done = tasks.filter(t => t['status'] == 'done');
    let doneCounter = done.length;
    document.getElementById('done_counter').innerHTML = doneCounter;

    let tasksInProgress = tasks.filter(t => t['status'] == 'inProgress');
    let inProgressCounter = tasksInProgress.length;
    document.getElementById('inProgress_counter').innerHTML = inProgressCounter;

    let awaitFeedback = tasks.filter(t => t['status'] == 'awaitFeedback');
    let awaitFeedbackCounter = awaitFeedback.length;
    document.getElementById('awaitFeedback_counter').innerHTML = awaitFeedbackCounter;

    let tasksInBoard = toDosCounter + inProgressCounter + awaitFeedbackCounter;
    document.getElementById('tasksInBoard_counter').innerHTML = tasksInBoard;

    let urgent = tasks.filter(t => t['current_prio'] == 'urgent');                        
    let urgentCounter = urgent.length;
    document.getElementById('urgent_counter').innerHTML = urgentCounter;
}


/**
 * We look for the next deadline that has the priority 'urgent'
 */
function showNextUrgentDeadline() {
    let urgentDeadlines = [];
    tasks.forEach(task => { 
        if(task['current_prio'] == 'urgent') {                       
            urgentDeadlines.push(task['current_due_date']);          
        }
   });  
                                                                  
   if(urgentDeadlines.length == 0) {                                 
    document.getElementById('next_due_date').innerHTML = 'No urgent due dates';
   } else if(urgentDeadlines.length == 1) {                          
    document.getElementById('next_due_date').innerHTML = urgentDeadlines[0];
   } else {                                                          
    let nextUrgentDeadline = closestUrgentDeadline(urgentDeadlines);
    document.getElementById('next_due_date').innerHTML = nextUrgentDeadline;
   }
}


/**
 * This function calculates the closest deadline; 
 * 
 * @param {Array} deadlines - contains the dates with priority 'urgent'
 * @returns {Date} - the closest deadline with priority 'urgent'
 */
function closestUrgentDeadline(deadlines) {
    let today = new Date().getTime();            
    let nextDeadline = null;                       
    let smallestDifference = Infinity;             

    deadlines.forEach(deadline => {
        const comparedDate = new Date(deadline).getTime();
        const difference = comparedDate - today;
        if (difference < smallestDifference) {
            smallestDifference = difference;
            nextDeadline = deadline;
        }
    });

    nextDeadline = getOtherDeadlineFormat(nextDeadline);
    return nextDeadline;
}


/**
 * This function will format the date into american date format (e.g. 'December 24, 2023')
 * 
 * @param {Date} deadline - the date we want to format 
 * @returns {Date} - 'en-US' date format
 */
function getOtherDeadlineFormat(deadline) {
    const deadlineFormat = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', deadlineFormat); 
}

