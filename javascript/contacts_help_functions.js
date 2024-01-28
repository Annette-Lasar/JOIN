/**
 * Extracts initials from contact name.
 * 
 * @param {number} i - index of current contact.
 * @returns 
 */
function loadInitials(i) {
    let name = allContacts[i]['name'];
    let initials = '';
    if (hasWhiteSpace(name)) {
      name = name.split(' ');
      for (let j = 0; j < name.length; j++) {
        initials += name[j][0];
      }
    } else {
      initials = name[0];
    }
    return initials;
  }
  
  /**
   * Checks if the pressed key is a space
   * 
   * @param {string} evt - key pressed
   * @returns true if the key is a number or false if it is a letter or symbol
   */
  function isSpace(evt) {
    if (/^\s/.test(evt.value)){
        return false;
    }
    return true;
  }
  
  function hasWhiteSpace(name) {
    return name.indexOf(' ') >= 0;
  }
  
  function validate(input) {
    if (/^\s/.test(input.value)){
        input.value = '';
    }
  }
  
  function removeExtraSpaces(input) {
    input.value = input.value.replace(/ +/g, ' ');
  }
  
  function capitalize(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' ');
  }
  
  /**
   * Shows Add new contact form.
   */
  function showAddForm() {
    document.getElementById('contact_form').innerHTML = addNewContactFormTemplate();
    formAnimation();
  }
  
  /**
   * Shows Edit contact form.
   */
  function showEditForm() {
    let i = currentContactIndex();
    document.getElementById('contact_form').innerHTML = editContactFormTemplate(i);
    loadContactValues(i);
    formAnimation();
  }
  
  /**
   * Loads the actual values for a contact that we will change into the edit contact input fields.
   * 
   * @param {number} i - edited contact index.
   */
  function loadContactValues(i) {
    document.getElementById('add_name').value = allContacts[i]['name'];
    document.getElementById('add_email').value = allContacts[i]['e_mail'];
    document.getElementById('add_phone').value = allContacts[i]['phone'];
  }
  
  /**
  * Removes all values from add new contact input fields.
  */
  function resetAddNewContactValues() {
    document.getElementById('add_name').value = '';
    document.getElementById('add_email').value = '';
    document.getElementById('add_phone').value = '';
  }
  
  /**
  * Shows small menu with contact edit or delete options.
  */
  function showOptions() {
    document.getElementById('empty').style.display = 'block';
    document.getElementById('edit_delete').classList.remove('slide-out-edit');
    document.getElementById('edit_delete').classList.add('slide-in-edit');
  }
  
  /**
  * Hides the menu with contact edit or delete options.
  */
  function hideOptions() {
    document.getElementById('edit_delete').classList.remove('slide-in-edit');
    document.getElementById('edit_delete').classList.add('slide-out-edit');
    setTimeout(() => {
      document.getElementById('empty').style.display = 'none';
    }, 300);
  }

  function loadFirstLetter(name) {
    let firstLetter = '';
    for (let i = 0; i < name.length; i++) {
        if(name[i] == ' '){
            continue
        }else {
            firstLetter = name[i];
            break
        }
    }
    return firstLetter.toUpperCase()
}