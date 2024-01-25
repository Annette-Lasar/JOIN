const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const USER_COLORS = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
/* let allContacts = []; */
let tasks;

/**
 * This function initializes the contacts on page load
 */
async function initContacts() {
    init();
    await loadContactsAndTasksUserOrGuest();
    renderGroupLetters();
    addContactToGroup();
    loadColors();
    adaptInitialsColor();
    checkContactsInGroup();
    emptyContactList();
}

/**
 * This function loads contacts data for user or guest from server.
 */
async function loadContactsAndTasksUserOrGuest() {
    let userLogin = localStorage.getItem('userLogin');
    if (userLogin == 'true') {
        let user = await loadUserData();
        if (user) {
            allContacts = JSON.parse(await getItem(`${user.email}_contacts`));
            tasks = JSON.parse(await getItem(`${user.email}_tasks`));
        }
    } else {
        allContacts = JSON.parse(await getItem('guestContacts'));
        tasks = JSON.parse(await getItem(`guestTasks`));
    }
}


/**
 * This function sends contacts data for user or guest from server.
 */
async function sendContactsToServer() {
    let userLogin = localStorage.getItem('userLogin');
    if (userLogin == 'true') {
        let user = await loadUserData();
        if (user) {
            await setItem(`${user.email}_contacts`, JSON.stringify(allContacts));
            await setItem(`${user.email}_tasks`, JSON.stringify(tasks));
        }
    } else {
        await setItem('guestContacts', JSON.stringify(allContacts));
        await setItem('guestTasks', JSON.stringify(tasks));
    }
    await initContacts();
}

/**
 * Loads user e-mail from local storage and compares it with e-mails within server.
 * 
 * @returns user 
 */
async function loadUserData() {
    let userEmail = localStorage.getItem('userEmail');
    userEmail = userEmail.replace(/"/g, '');
    users = JSON.parse(await getItem('users'));
    let user = users.find((u) => u.email === userEmail);
    return user
}

/**
 * Creates group for each letter in alphabet. This is needed for sorting all contacts alphabeticaly.
 */
function renderGroupLetters() {
    document.getElementById('contact_list').innerHTML = '';
    for (let i = 0; i < GROUPS.length; i++) {
        const letter = GROUPS[i];
        document.getElementById('contact_list').innerHTML += groupsTemplate(letter);
    }
}

/**
 * Renders empty contact list information.
 */
function emptyContactList() {
    if (allContacts == '') {
        document.getElementById('contact_list').innerHTML = '<h1 style="text-align: center; margin-top: 120px ;">No contacts added yet. Add some!</h1>'
    }
}

/**
 * Hides group if no contacts in this group exist.
 */
function checkContactsInGroup() {
    for (let i = 0; i < GROUPS.length; i++) {
        const letter = GROUPS[i];
        let contact = document.getElementById('contacts' + letter);
        if (contact.innerHTML == '') {
            document.getElementById('group' + letter).classList.add('d-none')
        }
    }
}

/**
 * Adds contact to group. This depends on the beginning letter odf the contact name.
 */
function addContactToGroup() {
    for (let i = 0; i < allContacts.length; i++) {
        let name = allContacts[i]['name'];
        let firstLetter = name.slice(0, 1);
        document.getElementById('contacts' + firstLetter).innerHTML += addContactToGroupTemplate(name, i);
    }
}

/**
 * Loads the contact icon background color.
 */
function loadColors() {
    for (let i = 0; i < allContacts.length; i++) {
        const color = allContacts[i]['color'];
        document.getElementById("initials" + i).style.backgroundColor = color;
    }
}

/**
 * Adapts the initials color to background color. If the brightness of background is to low
 * then the initials will apear white and if the brightness is to high then the initials will
 * appear black.  
 */
function adaptInitialsColor() {
    for (let i = 0; i < allContacts.length; i++) {
        const containerID = "initials" + i;
        adaptInitialsToBackground(containerID);
    }
}

/**
 * Hides contact information details.
 */
function hideContactInfo() {
    document.getElementById('contacts').style.display = 'none';
    document.getElementById('edit_contact_button').style.display = 'none';
    document.getElementById('contact_details').style.display = 'none';
}

/**
 * Shows clicked contact information details.
 * 
 * @param {number} i - currently clicked contact index.
 */
function showContactInfo(i) {
    setTimeout(() => {
        document.getElementById('contact_details').classList.remove('slide-in');
    }, 200);
    document.getElementById('contacts').style.display = 'block';
    document.getElementById('edit_contact_button').style.display = 'block';
    document.getElementById('contact_details').style.display = 'flex';
    document.getElementById('contact_details').classList.add('slide-in');
    document.getElementById('contact_details').innerHTML = contactInfoTemplate(i);
    let bgColor = document.getElementById("initials" + i).style.backgroundColor;
    let color = document.getElementById("initials" + i).style.color;
    document.getElementById("color_large_" + i).style.backgroundColor = bgColor;
    document.getElementById("color_large_" + i).style.color = color;
}

/**
 * Hides Add new contact form.
 */
function hideAddForm() {
    document.getElementById('background').classList.remove('fade-in');
    document.getElementById('add_form').classList.remove('slide-in');
    document.getElementById('add_form').classList.add('slide-out');
    document.getElementById('background').classList.add('fade-out');
    setTimeout(() => {
        document.getElementById('contact_form').style.display = 'none';
    }, 500);
}

/**
 * Shows Edit contact form when trying to add contact with existing e-mail.
 */
function showEditFormWhenWrong(i) {
    document.getElementById('contact_form').innerHTML = editContactFormTemplate(i);
    loadContactValues(i);
    formAnimation();
}

/**
 * Adds an animation to add or edit contact form.
 */
function formAnimation() {
    document.getElementById('contact_form').style.display = 'flex';
    document.getElementById('add_form').classList.remove('slide-out');
    document.getElementById('background').classList.remove('fade-out');
    document.getElementById('background').classList.add('fade-in');
    document.getElementById('add_form').classList.add('slide-in');
}

/**
 * 
 * @returns a random color for new contact.
 */
function randomUserColor() {
    let random = Math.floor(Math.random() * USER_COLORS.length);
    let randomColor = USER_COLORS[random];
    return randomColor
}

/**
 * When the add contact form is filled with new contact informations, 
 * then the informations will be sent to server. Else an Alert will appear over
 * edit existing contact form.
 */
async function addNewContact() {
    if (pushNewContact()) {
        hideAddForm();
        await sendContactsToServer();
        resetAddNewContactValues();
        showNewContact();
        createdContactAnimation();
    } else {
        renderAlert('alert_container', 'alert_content', 'Contact with this e-mail already exists!');
    }
}

/**
 * The created contact information will permanentli be shown.
 */
function showNewContact() {
    let id = allContacts.length - 1;
    showContactInfo(`${id}`);
    document.getElementById(`${id}`).focus();
}

/**
 * When new contact is created, a small info will be animated.
 */
function createdContactAnimation() {
    setTimeout(() => {
        document.getElementById('contact_created').style.display = 'block';
        document.getElementById('contact_created').classList.add('slide-in');
    }, 300);
    setTimeout(() => {
        document.getElementById('contact_created').classList.add('slide-out');
    }, 1300);
    setTimeout(() => {
        document.getElementById('contact_created').classList.remove('slide-in');
        document.getElementById('contact_created').classList.remove('slide-out');
        document.getElementById('contact_created').style.display = 'none';
    }, 1400);
}

/**
 * Sends the informations from add contact form to the server if the contact not exist and if not then it
 * loads edit contact form with an alert that the contact you trying to create already exists.
 * 
 * @returns false when contact exists, and true when the new contact is pushed to the server.
 */
function pushNewContact() {
    let inputName = document.getElementById('add_name').value;
    let inputEMail = document.getElementById('add_email').value;
    let inputPhone = document.getElementById('add_phone').value;
    let color = randomUserColor();
    if (allContacts.some(item => item.e_mail === inputEMail)) {
        let i = allContacts.findIndex(function (item, i) {
            return item.e_mail === inputEMail;});
        showEditFormWhenWrong(i);
        return false;
    } else {
        pushNewContactTemplate(inputName, inputEMail, inputPhone, color);
        return true;
    }
}

/**
 * Template that pushes new contact information to alContacts array.
 * @param {string} inputName 
 * @param {string} inputEMail 
 * @param {string} inputPhone 
 * @param {string} color 
 */
function pushNewContactTemplate(inputName, inputEMail, inputPhone, color) {
    allContacts.push(
        {
            name: inputName,
            e_mail: inputEMail,
            phone: inputPhone,
            color: color
        }
    );
}

/**
 * Sends the changes made on a contact to the server.
 * 
 * @param {number} i edited contact index.
 */
async function saveContactChanges(i) {
    updateContact(i);
    hideAddForm();
    await sendContactsToServer();
    showContactInfo(i);
    document.getElementById(i).focus();
}

/**
 * Sends the changes made on a contact to the allContacts array.
 * 
 * @param {number} i - edited contact index.
 */
function updateContact(i) {
    let inputName = document.getElementById('add_name').value;
    let inputEMail = document.getElementById('add_email').value;
    let inputPhone = document.getElementById('add_phone').value;
    allContacts[i]['name'] = inputName;
    allContacts[i]['e_mail'] = inputEMail;
    allContacts[i]['phone'] = inputPhone;
    updateCurrentContactsInTasks();
}

/**
 * This funtction deletes a contact.
 */
async function deleteAContact() {
    let index = currentContactIndex();
    allContacts.splice(index, 1);
    updateCurrentContactsInTasks();
    await sendContactsToServer();
    hideContactInfo();
}

/**
 * Shows an alert when trying to delete a contact.
 * 
 * @param {string} containerId - alert container id
 * @param {string} messageId - message container id
 * @param {string} alertMessage - message that will apear on the alert screen
 */
function renderAlertDeleteContact(containerId, messageId, alertMessage) {
    openOrCloseAlertContainer(containerId, 'open');
    const alertContent = document.getElementById(messageId);
    alertContent.innerHTML = '';
    if (containerId === 'alert_container') {
        alertContent.innerHTML = generateAlertContentHTML(alertMessage);
    } else if (containerId === 'confirm_container') {
        alertContent.innerHTML = generateConfirmDeleteContactHTML(alertMessage);
    }
}

/**
 * Loads the index of a contact that we want to edit or delete.
 * 
 * @returns index of the current contact
 */
function currentContactIndex() {
    let contactHTML = document.getElementById('contact_details').getElementsByTagName('div');
    let elementId = contactHTML[1].getAttribute('id');
    let sliceFrom = elementId.lastIndexOf('_') + 1;
    let index = elementId.slice(sliceFrom);
    return index;
}

/**
 * Checks if the pressed key is a symbol or letter or number
 * 
 * @param {string} evt - key pressed
 * @returns true if the key is a number or false if it is a letter or symbol
 */
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

/**
 * Update all contact changes made in allContacts array to the tasks array
 */
function updateCurrentContactsInTasks() {
    for (let i = 0; i < tasks.length; i++) {
        const updatedArray = tasks[i]['current_contacts'].filter(obj1 =>
            allContacts.some(obj2 =>
                obj2.name === obj1.name &&
                obj2.e_mail === obj1.e_mail &&
                obj2.phone === obj1.phone &&
                obj2.color === obj1.color
            )
        );
        tasks[i]['current_contacts'].length = 0;
        Array.prototype.push.apply(tasks[i]['current_contacts'], updatedArray);
    }
}