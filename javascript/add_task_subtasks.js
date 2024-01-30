
/**
 * Shows two buttons that enable the user to either refuse or accept
 * the input value as a new subtask
 * @param {string} wrapperId - id of the div element that contains the x and the accept icon
 * The id can either refer to the div element in the mobile view or the one in the desktop view
 * @param {string} plusIconId - id of the plus icon (either mobile or desktop)
 * that holds the onclick function
 */
function showCancelAndAcceptSubtask(wrapperId, plusIconId) {
    const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);
    const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
    CLOSE_AND_CHECK_WRAPPER.classList.remove('d-none');
    SUBTASK_PLUS_ICON.classList.add('d-none');
  }
  
  /**
   * This function clears the input field if the user wants to abort the operation.
   * @param {string} inputId - All these IDs can either refer to the html element for the
   * mobile view (small) or for the desktop view (big)
   * @param {string} wrapperId - see above
   * @param {string} plusIconId - see above
   */
  function clearSubtask(inputId, wrapperId, plusIconId) {
    const SUBTASK_INPUT_BOX = document.getElementById(inputId);
    const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
    const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);
    SUBTASK_INPUT_BOX.value = '';
    hideCancelAndAcceptSubtask(CLOSE_AND_CHECK_WRAPPER, SUBTASK_PLUS_ICON);
  }
  
  /**
   * This function returns to the view with the plus icon instead of the x or accept icon
   * @param {*} CLOSE_AND_CHECK_WRAPPER
   * @param {*} SUBTASK_PLUS_ICON
   */
  function hideCancelAndAcceptSubtask(
    CLOSE_AND_CHECK_WRAPPER,
    SUBTASK_PLUS_ICON
  ) {
    CLOSE_AND_CHECK_WRAPPER.classList.add('d-none');
    SUBTASK_PLUS_ICON.classList.remove('d-none');
  }
  
  /**
   * With this function the user can delete a certain subtask.
   * @param {integer} i - This is the index that refers to the current subtask.
   */
  function deleteSubtask(i) {
    subTasks.splice(i, 1);
    renderSubtasks();
  }
  
  /**
   * With this function the user can add subtasks which are shown in a list underneath
   * the input field.
   * @param {string} inputId - All these strings refer to IDs that are transferred as
   * parameters in the onclick functions in the html code. There are two different
   * parameters ('small' and 'big') according to whether the function is executed in
   * the mobile or the desktop version of the app.
   * @param {string} wrapperId - see above
   * @param {string} plusIconId - see above
   */
  function addSubtask(inputId, wrapperId, plusIconId, event) {
    event.stopPropagation();
    const SUBTASK_INPUT_BOX = document.getElementById(inputId);
    const CLOSE_AND_CHECK_WRAPPER = document.getElementById(wrapperId);
    const SUBTASK_PLUS_ICON = document.getElementById(plusIconId);
  
    if (SUBTASK_INPUT_BOX.value !== '') {
      const newSubtask = {
        subtask_name: SUBTASK_INPUT_BOX.value,
        checked_status: false,
      };
      subTasks.push(newSubtask);
    } else {
      renderAlert(
        'alert_container',
        'alert_content',
        'Please enter text for your subtask!'
      );
    }
    renderSubtasks();
    SUBTASK_INPUT_BOX.value = '';
    hideCancelAndAcceptSubtask(CLOSE_AND_CHECK_WRAPPER, SUBTASK_PLUS_ICON);
  }
  
  /**
   * This function sets an event listener so that the user can add a
   * subtask by pressing the enter key.
   * @param {string} elementId - This is the id of the button that creates a new subtask.
   * @param {string} tasksId - This is the id of the input field.
   * @param {string} wrapperId - This is the id of the close and check wrapper.
   * @param {string} plusId - This is the id of the plus button.
   */
  function setupSubtaskEventListener(elementId, tasksId, wrapperId, plusId) {
    document.getElementById(elementId).addEventListener('click', function () {
      addSubtask(tasksId, wrapperId, plusId, event);
    });
  
    /**
     * This event listener checks if the enter key is pressed to create a new
     * subtask.
     */
    document
      .getElementById(tasksId)
      .addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          addSubtask(tasksId, wrapperId, plusId, event);
        }
      });
  }
  
  /**
   * With this function the subtasks of the array subTasks are rendered in the browser.
   */
  function renderSubtasks() {
    SUBTASK_CONTAINER_SMALL.innerHTML = '';
    SUBTASK_CONTAINER_BIG.innerHTML = '';
    for (let i = 0; i < subTasks.length; i++) {
      let subtask = subTasks[i];
      SUBTASK_CONTAINER_SMALL.innerHTML += generateSubtaskHTML(
        i,
        subtask,
        'small'
      );
      SUBTASK_CONTAINER_BIG.innerHTML += generateSubtaskHTML(i, subtask, 'big');
    }
  }
  
  /**
   * This function enables the user to edit his subtasks. It accesses the html element
   * that contains the subtask in question by its ID and exchanges the element for an
   * input field.
   * @param {integer} i - This is the index of the current subtask.
   * @param {string} containerType - This is either 'small' or 'big' and refers to the
   * viewport size (mobile or desktop.
   * @param {string} subtask - This is the text of the current subtaks.
   */
  function editSubtask(i, containerType, subtask) {
    let subtaskElement = document.getElementById(
      `subtask_list_wrapper_${containerType}_${i}`
    );
    subtaskElement.innerHTML = generateInputEditHTML(i, containerType, subtask);
  }
  
  /**
   * This function enables the user to edit a subtask's text.
   * @param {number} i - This is the index of a subtask in the subarray subtasks.
   * @param {string} containerType - This is either 'small' or 'big'.
   */
  function changeSubtaskText(i, containerType) {
    let editedInput = document.getElementById(`edit_input_${containerType}_${i}`);
    let editedSubtask = editedInput.value.trim();
    if (editedSubtask !== '') {
      subTasks[i].subtask_name = editedSubtask;
      renderSubtasks();
    } else {
      renderAlert(
        'alert_container',
        'alert_content',
        'Please enter text for your subtask'
      );
      renderSubtasks();
    }
  }