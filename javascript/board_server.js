/**
 * This function checks if a user is logged in or if the user has
 * guest status.
 * @returns - The function returns the user's data if a user is logged in.
 */
async function checkUser() {
    let userLogin = localStorage.getItem('userLogin');
    if (userLogin == 'true') {
      let userEmail = localStorage.getItem('userEmail');
      userEmail = userEmail.replace(/"/g, '');
      let user = users.find((u) => u.email == userEmail);
      return user;
    }
  }
  
  /**
   * This function gets the tasks array from the external server. 
   */
  async function loadTasksUserOrGuest() {
    let user = await checkUser();
    if (user) {
      tasks = JSON.parse(await getItem(`${user.email}_tasks`));
    } else {
      tasks = JSON.parse(await getItem('guestTasks'));
    }
  }
  
  /**
   * This function gets the contacts array from the external server.
   */
  async function loadContactsUserOrGuest() {
    let user = await checkUser();
    if (user) {
      contacts = JSON.parse(await getItem(`${user.email}_contacts`));
    } else {
      contacts = JSON.parse(await getItem('guestContacts'));
    }
  }
  
  /**
   * This function get the categories array from the external server.
   */
  async function loadCategoriesUserOrGuest() {
    let user = await checkUser();
    if (user) {
      categories = JSON.parse(await getItem(`${user.email}_categories`));
    } else {
      categories = JSON.parse(await getItem('guestCategories'));
    }
  }
  
  /**
   * This function sends the tasks array to the external server after
   * changes have been made to it. 
   */
  async function sendTasksToServer() {
    let user = await checkUser();
    if (user) {
      await setItem(`${user.email}_tasks`, JSON.stringify(tasks));
    } else {
      await setItem('guestTasks', JSON.stringify(tasks));
    }
    initBoard();
  }