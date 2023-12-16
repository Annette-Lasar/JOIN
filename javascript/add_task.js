/**
 * Toggles dropdown lists on add tasks page by displaying all available options
 * of the dropdown list and rotating the arrow 180 deg
 * Shows an option to add a new task category resp a new contact
 * @param {string} idContainer - represents the container that holds the list of options
 * @param {string} idArrow  - represents the img element with the arrow
 */
function toggleDropdownLists(idContainer, idArrow) {
    const CATEGORY_List = document.getElementById(idContainer);
    const SELECT_ARROW = document.getElementById(idArrow);
    CATEGORY_List.classList.toggle('show');
    SELECT_ARROW.classList.toggle('turn');
  }