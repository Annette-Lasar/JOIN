/**
 * This function fetches the tasks array from the external server.
 */
async function getTasksFromServer() {
    let user = await checkUser();
    if (user) {
      console.log('User: ', user);
      allTasks = JSON.parse(await getItem(`${user.email}_tasks`));
    } else {
      console.log('User: ', user);
      allTasks = JSON.parse(await getItem('guestTasks'));
    }
  }
  
  /**
   * This function fetches the contacts array from the external server.
   */
  async function getContactsFromServer() {
    let user = await checkUser();
    if (user) {
      console.log('User: ', user);
      contacts = JSON.parse(await getItem(`${user.email}_contacts`));
    } else {
      console.log('User für Contacts: ', user);
      contacts = JSON.parse(await getItem('guestContacts'));
    }
  }
  
  /**
   * This function fetches the categories array from the external server.
   */
  async function getCategoriesFromServer() {
    let user = await checkUser();
    if (user) {
      categories = JSON.parse(await getItem(`${user.email}_categories`));
    } else {
      categories = JSON.parse(await getItem('guestCategories'));
    }
  }
  
  /**
   * This function sends the categories array to the external server.
   */
  async function sendCategoriesToServer() {
    let user = await checkUser();
    if (user) {
      await setItem(`${user.email}_categories`, JSON.stringify(categories));
    } else {
      await setItem('guestCategories', JSON.stringify(categories));
    }
  }
  
  /**
   * This function calls all functions necessary to create a new
   * task and send it to the external server.
   */
  async function sendCreatedTask() {
    await getTasksFromServer();
    allTasks.push(createdTask);
    await sendNewTaskToServer();
  }
  
  /**
   * This function sends a newly created task to the external server. It 
   * displays a success message an directs the user to the board where
   * the new task is available.
   */
  async function sendNewTaskToServer() {
    let user = await checkUser();
    if (allTasks.length > 0) {
      if (user) {
        await setItem(`${user.email}_tasks`, JSON.stringify(allTasks));
        clearAllTaskContainers();
        renderAlert(
          'alert_container',
          'alert_content',
          'A new task has successfully been created and added to your board.'
        );
      } else {
        await setItem('guestTasks', JSON.stringify(allTasks));
        clearAllTaskContainers();
        renderAlert(
          'alert_container',
          'alert_content',
          'A new task has successfully been created and added to the board.'
        );
      }
      redirectToBoardPage();
    }
  }

  /**
   * This function checks if a user is logged in. 
   * @returns - The function returns the user data if a user
   * is logged in. Otherwise it returns 'undefined' for a logged-in
   * guest.
   */
  async function checkUser() {
    let userLogin = localStorage.getItem('userLogin');
    if (userLogin == 'true') {
      let userEmail = localStorage.getItem('userEmail');
      userEmail = userEmail.replace(/"/g, '');
      let users = JSON.parse(await getItem('users'));
      let user = users.find((u) => u.email == userEmail);
      return user;
    }
  }

  /**
   * This function directs the user to the kanban board
   * after a new task has successfully been created.
   */
  function redirectToBoardPage() {
    window.location.href = 'board.html';
  }