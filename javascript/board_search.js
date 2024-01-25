/**
 * This function filters all tasks according to a term the user has entered into the input field.
 */
function filterTasks() {
    const listStatus = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    const search = document.getElementById('searchbar');
    const adjustedSearch = search.value.toLowerCase().trim();
    let totalFoundTasks = 0;
  
    for (const status of listStatus) {
      const listElement = document.getElementById(status);
      clearContainers(status);
      totalFoundTasks += processTasksForStatus(listElement, adjustedSearch, status);
    }
  
    showSearchResult(search, totalFoundTasks);
  }
  
  /**
   * This function searches titles and descriptions of all tasks for the keyword the user has
   * entered into the search field.
   * @param {string} listElement - This is the status of one list of the kanban board.
   * @param {string} adjustedSearch - This is the keyword the user is looking for, freed from
   * empty spaces and transformed to lower case characters. 
   * @param {string} status - This is the status of one of the four kanban board lists.
   * @returns - In the end the number of found matches is returned to the calling function.
   */
  function processTasksForStatus(listElement, adjustedSearch, status) {
    let foundTasks = 0;
    for (let i = 0; i < tasks.length; i++) {
      const oneTask = tasks[i];
      const taskStatus = oneTask.status;
      const newTruncatedSentence = truncateSentence(oneTask.description, 6);
      const completedSubtasksInPercent = calculateSubtaskPercentage(i, oneTask);
      if (
        oneTask.title.toLowerCase().includes(adjustedSearch) ||
        oneTask.description.toLowerCase().includes(adjustedSearch)
      ) {
        if (taskStatus === status) {
          listElement.innerHTML += generateToDoHTML(
            i,
            oneTask,
            newTruncatedSentence,
            completedSubtasksInPercent
          );
          foundTasks++;
          updateProgressBar(i, oneTask);
          updateCompletedTasks(i, tasks[i]);
          renderContactsOnOutsideCard(i, oneTask);
        }
      }
    }
    return foundTasks;
  }
  
  /**
   * This function shows the number of matches of the search. 
   * @param {HTMLElement} search - This is the input field for the search.
   * @param {number} totalFoundTasks - Total number of matches for a search.
   */
  function showSearchResult(search, totalFoundTasks) {
    const searchInfo = document.getElementById('search_matches');
    const numberOfMatches = document.getElementById('number_of_matches');
  
    if (!checkIfSearchValueIsEmpty(search)) {
      searchInfo.classList.add('visible');
      numberOfMatches.innerHTML = totalFoundTasks === 1 ? `${totalFoundTasks} match` : `${totalFoundTasks} matches`;
    } else {
      searchInfo.classList.remove('visible');
    }
  }
  
  
  /**
   * This function removes the information about a search's matches after a search.
   */
  function clearSearchInfos() {
    let search = document.getElementById('searchbar');
    let searchInfo = document.getElementById('search_matches');
    let numberOfMatches = document.getElementById('number_of_matches');
    if (checkIfSearchValueIsEmpty(search)) {
      searchInfo.classList.remove('visible');
      numberOfMatches.innerHTML = '';
    }
  }
  
  /**
   * This function checks if the input field for the search is empty. 
   * @param {HTMLElement} search - This is the input field for the search.
   * @returns - It returns 'true' if the input field for the search is empty. 
   */
  function checkIfSearchValueIsEmpty(search) {
    return search.value === '';
  }
  
  /**
   * This function empties the input field for the search, hides the information about
   * found matches and shows all tasks on the kanban board again.
   */
  function clearSearchField() {
    let search = document.getElementById('searchbar');
    search.value = '';
    clearSearchInfos();
    showTasksOnBoard();
  }
